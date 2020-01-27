import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './service/user/user.service';
import { UserRepository } from './repositories/user-repository/user-repository';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './service/auth/auth.service';
import { secretKey, JwtStrategy } from './service/auth/jwt.strategy';
import {JwtModule} from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './domain/schemas/user.schemas';
import { UserActivityController } from './controllers/user-activity/user-activity.controller';
import { UserActivitySchema } from './domain/schemas/user-activity.schema';
import { UserActivityService } from './service/user-activity/user-activity.service';
import { UserActivityRepository } from './repositories/user-activity-repository/user-activity.repository';
import { WebsocketGateway } from './websockets/websocket.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/admin', {
      useNewUrlParser: true,
      useUndefiedTopology: true
    }),
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema},
      {name: 'UserActivity', schema: UserActivitySchema},
    ]),
    JwtModule.register({secret: secretKey,
                       signOptions:  {
                         expiresIn: '600m'
                        }
                      })
  ],
  controllers: [AppController, UserController, AuthController, UserActivityController],
  providers: [AppService, UserService, UserRepository, AuthService, JwtStrategy, UserActivityService, UserActivityRepository, WebsocketGateway],
})
export class AppModule {}
