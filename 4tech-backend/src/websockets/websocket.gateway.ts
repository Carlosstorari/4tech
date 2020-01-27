import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
//herda Injectable
@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer() server;

  notifyOnLike(userActivityId: string, userId: string) {
    this.server.emit('events', {mediaId: userActivityId, userId});
  }
}
