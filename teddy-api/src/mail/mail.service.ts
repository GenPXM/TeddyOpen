import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailer: MailerService) {}

  async sendPasswordResetEmail(params: {
    to: string;
    token: string;
    tenantName?: string;
  }) {
    const { to, token, tenantName } = params;

    const subject = tenantName
      ? `Redefinição de senha - ${tenantName}`
      : 'Redefinição de senha';

    const text = `
Você solicitou a redefinição de senha.

Seu token de redefinição é: ${token}

Esse token é válido por alguns minutos. 
Se você não solicitou essa redefinição, ignore este email.
`.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Você solicitou a redefinição de senha${
          tenantName ? ` no tenant <strong>${tenantName}</strong>` : ''
        }.</p>
        <p>Seu token de redefinição é:</p>
        <p style="font-size: 20px; font-weight: bold; letter-spacing: 2px;">
          ${token}
        </p>
        <p>Esse token é válido por alguns minutos.</p>
        <p>Se você não solicitou essa redefinição, apenas ignore este email.</p>
      </div>
    `;

    try {
      await this.mailer.sendMail({
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Email de redefinição enviado para ${to}`);
    } catch (err) {
      this.logger.error(
        `Erro ao enviar email de redefinição para ${to}: ${String(
          (err as Error).message,
        )}`,
      );
    }
  }
}
