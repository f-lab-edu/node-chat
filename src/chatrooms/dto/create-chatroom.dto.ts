import { IsArray, ArrayMinSize, IsUUID, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsArray()
  @ArrayMinSize(2, {
    message: '최소 두 명 이상의 사용자와 채팅방을 생성해야 합니다.',
  })
  @IsUUID('all', { each: true, message: '유효하지 않은 UUID 형식입니다.' })
  memberUuids!: string[];
  @IsString()
  roomName!: string;
}
