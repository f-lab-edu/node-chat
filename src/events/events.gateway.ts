import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisService } from 'src/redis/redis.service';
import { Server } from 'ws';

@WebSocketGateway() // 아래의 EventsGateWay 클래스를 웹소켓 서버 역할로 만들어준다.
export class EventsGateway /* 웹소켓 기능을 구현할 클래스*/ {
  @WebSocketServer() /* Nest가 내부적으로 웹소켓 서버 인스턴스를 여기에 넣어줌 */
  server!: Server; // Property 'server' has no initializer and is not definitely assigned in the constructor.ts(2564)
  /*
    클래스의 모든 속성이 생성자에서 반드시 초기화되어야 한다는 규칙인 'strictPropertyInitialization 옵션이 켜져 있기 때문에 발생.
    NestJS에서 @webSocketServer() 데코레이터를 사용할 경우, NestJS 런타임이 이 속성을 주입해주는데, TypeScript는 이를 알지 못해 오류를 낸다.
    Non-null Assertion Operator(!)을 사용해서 TypeScript 에게 '이 속성은 나중에 주입되니 걱정하지 마' 알려줘야 햔다.
  */

  constructor(
    /* @Inject(RedisService) */ private readonly redisService: RedisService,
  ) {}

  // 구독 채널(Key) : 웹소켓으로 연결된 클라이언트들의 모음
  private roomMap: Map<string, Set<any>> = new Map();

  handleConnection(client: any, ...args: any[]) {
    client.send(JSON.stringify({ event: 'ready', message: 'connected' }));
  }

  handleDisconnect(client: any) {
    this.roomMap.forEach((clients) => clients.delete(client));
    console.log('WebSocket disconnected:', client?.id);
  }

  @SubscribeMessage('join-rooms')
  async handleJoinRooms(client: any, rooms: string[]) {
    rooms.forEach((room) => {
      if (!this.roomMap.has(room)) {
        // 서버 인스턴스에 채널 최초 등록
        this.roomMap.set(room, new Set());

        // Redis Subscribe
        this.redisService.subscribe(room, (message) => {
          const parsed = JSON.parse(message);

          // room에 등록 & 웹소켓으로 연결된 클라이언트에게 메시지 전송
          this.roomMap.get(room)?.forEach((cli) => {
            cli.send(JSON.stringify({ room, ...parsed }));
          });
        });
      }

      // 클라이언트를 방 목록에 추가
      // -- JavaScript의 Set은 같은 객체 중복 등록 방지함
      this.roomMap.get(room)?.add(client);
      console.log(`Client joined room ${room}`);
    });
  }

  @SubscribeMessage(
    'send-message',
  ) /* 클라이언트로부터 'send-message' 라는 이름의 메세지를 수신하면 해당 메서드 실행 */
  async onEvent(client: any, data: { room: string; message: string }) {
    console.log('Received data: ', data);
    const published = await this.redisService.publish(data.room, data.message);
    console.log('published: ', published);
  }
}
