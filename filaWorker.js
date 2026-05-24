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
                    text: `Olá!\nSeu pedido #${pedido.numero} foi confirmado.\n\nItens:\n${pedido.itens}\n\nValor Total: R$ ${pedido.total}`
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

consumirFila();