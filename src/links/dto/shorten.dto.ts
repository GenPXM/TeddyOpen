import { IsUrl, MaxLength } from 'class-validator';
export class ShortenDto {
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  originUrl: string;
}
