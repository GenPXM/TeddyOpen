import { IsOptional, IsUrl, MaxLength } from 'class-validator';
export class UpdateLinkDto {
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  originUrl?: string;
}
