import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import {
  from,
  map,
  Observable,
} from 'rxjs'; /* 리액티브 프로그래밍 라이브러리. Observable : 데이터 스트림을 다루는 방식. from([1,2,3]) : 배열을 Observable 로 바꿈. map(...) : 데이터 스트림을 변환함 */
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

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

  @SubscribeMessage(
    'events',
  ) /* 클라이언트로부터 'events' 라는 이름의 메세지를 수신하면 해당 메서드 실행 */
  onEvent(
    client: any,
    data: any,
  ): Observable<WsResponse<number>> /* 메세지 응답 형식 타입 */ {
    console.log('data: ', data);

    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
}
