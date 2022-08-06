import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  token: string;
}
