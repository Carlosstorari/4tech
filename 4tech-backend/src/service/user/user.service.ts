import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user-repository/user-repository';
import { LoginViewModel } from 'src/domain/login.viewmodel';
import { UserViewModel } from 'src/domain/user.viewmodel';

@Injectable()
export class UserService {
    constructor(readonly userRepository: UserRepository){}
    
    getUsers(){
        return this.userRepository.getUsers();
    }

    async createNewUser(newUser: UserViewModel){
        const userList = await  this.userRepository.getUsers();

        const existingUser = userList.find(x => x.userName === newUser.userName);
        if (existingUser) {
            throw new BadRequestException('This username already exists!');
        }

        return this.userRepository.createUser(newUser)
    }

    async attemptLogin(login: LoginViewModel){
        const userList = await this.userRepository.getUsers();

        const foundLogin = userList.find(x =>
            x.userLogin === login.userLogin &&
            x.userPassword === login.password
        )

        return foundLogin;
    }

    //atualizaUser(user: UserViewModel){
    //    const userList = this.userRepository.getUsers();
//
    //    const foundLogin = userList.find(x =>
    //        x.userLogin === user.userLogin &&
    //        x.userPassword === user.userPassword
    //    )
//
    //    if(foundLogin){
    //        
    //    } else {
    //        throw new BadRequestException('User does not exists!');
    //    }
    //}

    ///deleteOneUser(user: UserViewModel){
    ///    const dbAux = this.getUsers().filter(v => v.userLogin !== user.userLogin);
    ///    this.userRepository.db = [...dbAux]
    ///    return this.userRepository.getUsers();
    ///}

}
