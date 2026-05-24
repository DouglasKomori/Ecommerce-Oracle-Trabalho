require('dotenv').config();
const common = require("oci-common");
const queue = require("oci-queue");
const nodemailer = require("nodemailer");
const fs = require('fs');

const privateKey = fs.readFileSync('./douglassatoshi@unoeste.edu.br-2026-05-20T20_10_55.337Z.pem', 'utf-8');
const provider = new common.SimpleAuthenticationDetailsProvider(
    process.env.OCI_TENANCY_OCID,
    process.env.OCI_USER_OCID,
    process.env.OCI_FINGERPRINT,
    privateKey,
    null,
    common.Region.fromRegionId(process.env.OCI_REGION)
);

const queueClient = new queue.QueueClient({ authenticationDetailsProvider: provider });
queueClient.endpoint = process.env.OCI_QUEUE_ENDPOINT;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

async function consumirFila() {
    console.log("Worker iniciado: Aguardando mensagens na fila...");
    
    while (true) {
        try {
            const response = await queueClient.getMessages({
                queueId: process.env.OCI_QUEUE_OCID,
                visibilityInSeconds: 60,
                timeoutInSeconds: 20,
                limit: 1
            });

            if (response.getMessages.messages.length > 0) {
                const msg = response.getMessages.messages[0];
                
                const pedido = JSON.parse(Buffer.from(msg.content, 'base64').toString('utf-8'));

                await transporter.sendMail({
                    from: process.env.APPROVED_SENDER,
                    to: pedido.emailCliente,
                    subject: `Lojinha Fullstack - Pedido #${pedido.numero} Confirmado!`,
                    text: gerarTextoEmail(pedido),
                    html: gerarHtmlEmail(pedido)
                });

                console.log(`E-mail enviado com sucesso para: ${pedido.emailCliente}`);

                await queueClient.deleteMessage({
                    queueId: process.env.OCI_QUEUE_OCID,
                    messageReceipt: msg.receipt
                });
            }
        } catch (error) {
            console.error("Erro na fila:", error);
            await new Promise(resolve => setTimeout(resolve, 5000)); 
        }
    }
}

function gerarTextoEmail(pedido) {
    const itens = Array.isArray(pedido.itens)
        ? pedido.itens.map(i => `- ${i.nome} (x${i.quantidade}) - R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}`).join('\n')
        : pedido.itens;

    return `Olá!\n\nSeu pedido #${pedido.numero} foi confirmado.\n\nItens:\n${itens}\n\nValor Total: R$ ${parseFloat(pedido.total).toFixed(2).replace('.', ',')}\n\nObrigado pela compra!\nLojinha Fullstack`;
}

function gerarHtmlEmail(pedido) {
    const totalFormatado = parseFloat(pedido.total).toFixed(2).replace('.', ',');

    const linhasItens = Array.isArray(pedido.itens)
        ? pedido.itens.map(item => {
            const preco = item.preco.toFixed(2).replace('.', ',');
            const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
            return `
                <tr>
                    <td style="padding:14px;border-bottom:1px solid #eee;color:#333;">${item.nome}</td>
                    <td style="padding:14px;border-bottom:1px solid #eee;text-align:center;color:#333;">${item.quantidade}</td>
                    <td style="padding:14px;border-bottom:1px solid #eee;text-align:right;color:#333;">R$ ${preco}</td>
                    <td style="padding:14px;border-bottom:1px solid #eee;text-align:right;color:#333;font-weight:bold;">R$ ${subtotal}</td>
                </tr>`;
        }).join('')
        : `<tr><td colspan="4" style="padding:14px;color:#666;">${pedido.itens}</td></tr>`;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pedido Confirmado</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
            <td style="background:linear-gradient(135deg,#212529 0%,#495057 100%);padding:40px 30px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:0.5px;">Lojinha Fullstack</h1>
                <p style="color:#adb5bd;margin:8px 0 0 0;font-size:14px;">Confirmação de Pedido</p>
            </td>
        </tr>
        <tr>
            <td style="padding:35px 30px 20px 30px;">
                <h2 style="color:#212529;margin:0 0 10px 0;font-size:22px;">Pedido confirmado com sucesso!</h2>
                <p style="color:#6c757d;margin:0 0 25px 0;font-size:15px;line-height:1.5;">Obrigado pela sua compra! Aqui está o resumo do que você pediu:</p>
                <div style="background:#f8f9fa;padding:15px 20px;border-left:4px solid #212529;border-radius:4px;margin-bottom:25px;">
                    <span style="color:#6c757d;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Número do pedido</span><br>
                    <strong style="color:#212529;font-size:18px;">#${pedido.numero}</strong>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:25px;">
                    <thead>
                        <tr style="background:#f8f9fa;">
                            <th style="padding:14px;text-align:left;color:#6c757d;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Produto</th>
                            <th style="padding:14px;text-align:center;color:#6c757d;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Qtd</th>
                            <th style="padding:14px;text-align:right;color:#6c757d;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Preço</th>
                            <th style="padding:14px;text-align:right;color:#6c757d;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linhasItens}
                    </tbody>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="background:#212529;padding:18px 25px;border-radius:6px;text-align:right;">
                            <span style="color:#adb5bd;font-size:14px;">Valor Total: </span>
                            <span style="color:#ffffff;font-size:22px;font-weight:bold;">R$ ${totalFormatado}</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="background:#f8f9fa;padding:25px 30px;text-align:center;border-top:1px solid #e9ecef;">
                <p style="color:#6c757d;margin:0 0 5px 0;font-size:13px;">Este e-mail é um comprovante automático do seu pedido.</p>
                <p style="color:#adb5bd;margin:0;font-size:12px;">&copy; 2026 Lojinha Fullstack. Todos os direitos reservados.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

consumirFila();