import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user-repository/user-repository';
import { UserActivityDto } from 'src/domain/dto/user-activity.dto';
import { UserActivityCommentDto } from 'src/domain/dto/user-activity-comment.dto';
import { UserActivityRepository } from 'src/repositories/user-activity-repository/user-activity.repository';
import { UserActivity } from 'src/domain/schemas/user-activity.schema';
import { readFileSync } from 'fs';
import { LikeOrDislikeViewModel } from 'src/domain/like-or-dislike.viewmodel';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';

@Injectable()
export class UserActivityService {
    constructor(private readonly userRepository: UserRepository,
        private userActivityRepository: UserActivityRepository,
        private readonly websocketGateway: WebsocketGateway){}


    async getRecentUploads(index: string) {
        const indexAsNumber = parseInt(index, 10);

        if (isNaN(indexAsNumber)) {
            throw new BadRequestException('Invalid Index');
        }

        const recentUploads = await this.userActivityRepository.getPaged(indexAsNumber);
        
        return this.convertImagesToBase64(recentUploads);
        
        //return await this.userActivityRepository.getPaged(indexAsNumber);
    }

    async likeOrDislikeActivity(likeOrDislikeActivity: LikeOrDislikeViewModel) {
        const userActivity = await this.userActivityRepository.getById(likeOrDislikeActivity.userActivityId)

        if(!userActivity){
            throw new BadRequestException('An User Activity with the given id does not exist')
        }

        const user = await this.userRepository.getById(likeOrDislikeActivity.userId)

        if(!user){
            throw new BadRequestException('An User with the given id does not exists');
        }

        if(userActivity.likes.includes(user._id.toString())){
            userActivity.likes = userActivity.likes.filter(x => x !== user._id.toString());
        } else {
            userActivity.likes.push(user._id.toString());
        }
        //recebe like ou dislike
        const updatedUserActivity =  await this.userActivityRepository.update(userActivity);
        this.websocketGateway.notifyOnLike(userActivity._id, userActivity.userId);

        return updatedUserActivity;

    }

    async uploadImage(userId: string, fileName: string, description: string){
        const user = await this.userRepository.getById(userId);

        if(!user) {
            throw new BadRequestException('This user does not exist');
        }

        const uploadImageObj = new UserActivityDto(userId, fileName, user.userName)
        if (description){
            uploadImageObj.comments.push(new UserActivityCommentDto(
                userId,
                user.userName,
                description
            ));
        }
        const createdUserActivity =  await this.userActivityRepository.create(uploadImageObj);

        return this.convertImageToBase64ForOneFile(createdUserActivity);
    }

    convertImagesToBase64(userActivities: UserActivity[]) {
        //retorna quando todas as iterações estiverem realizadas
        return Promise.all(
            userActivities.map(userActivity => {
                return {
                    ...userActivity,//<-faz copia do atributos
                    //vai a pasta images e retorna a imagem na base64
                    imgEncoded: readFileSync('../images/'+ userActivity.fileName, 'base64')
                };
            }),
        );
    }

    convertImageToBase64ForOneFile(userActivity: UserActivity){
        return {
            ...userActivity,
            imgEncoded: readFileSync('../images/'+ userActivity.fileName, 'base64'),
        }
    }
}
