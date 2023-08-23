import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('hello')
  handleHello(@MessageBody() data: string): void {
    console.log(data);
    this.server.emit('hello', 'Hello from Server :)');
  }

  @SubscribeMessage('world')
  handleWorld(@MessageBody() data: { id: number }) {
    if (data.id === 1) {
      this.server.emit('listen-id', {
        message: `Listening on your id:${data.id}`,
      });
    } else {
      return { message: `${data.id} not found!` };
    }
  }

  afterInit(): void {
    console.log('Initialized');
  }

  handleConnection(): void {
    console.log('Connected');
  }

  handleDisconnect(): void {
    console.log('Disconnected');
  }
}
