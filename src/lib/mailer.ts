import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"Metrópole Imóveis" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export function resetPasswordEmailHtml(name: string, url: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color: #242625;">Metrópole Imóveis</h2>
    <p>Olá, ${name},</p>
    <p>Recebemos uma solicitação para redefinir sua senha de acesso ao painel administrativo.</p>
    <p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#E07E58;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
        Redefinir senha
      </a>
    </p>
    <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
    <p style="color:#888;font-size:12px;">Metrópole Imóveis · Uberlândia - MG</p>
  </div>`;
}
