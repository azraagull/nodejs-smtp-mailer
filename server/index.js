const express = require('express');
const http = require('http');
const path = require('path');
const tls = require('tls');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const PORT = 5000;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

const options = {
  host: 'smtp.gmail.com',
  port: 465,
};

const socket = tls.connect(options, () => {
  console.log('SMTP sunucusuna bağlandı.');
});

socket.setEncoding('utf8');

socket.on('data', (data) => {
  console.log(data);
});

socket.on('error', (error) => {
  console.error('Hata: ', error);
});

socket.on('end', () => {
  console.log('Bağlantı sonlandı.');
});

function sendCommand(command) {
  return new Promise((resolve, reject) => {
    socket.write(command, () => {
      const onDataReceived = (data) => {
        resolve(data);
        socket.removeListener('data', onDataReceived);
      };
      socket.on('data', onDataReceived);
    });
  });
}

app.post('/send-email', async (req, res) => {
  const { senderEmail, receiverEmail, subject, message } = req.body;

  try {
    await sendCommand('EHLO localhost\r\n');
    await sendCommand('AUTH LOGIN\r\n');
    await sendCommand(Buffer.from(process.env.SMTP_EMAIL, 'utf-8').toString('base64') + '\r\n');
    await sendCommand(Buffer.from(process.env.SMTP_PASSWORD, 'utf-8').toString('base64') + '\r\n');
    await sendCommand(`MAIL FROM:<${senderEmail}>\r\n`);
    await sendCommand(`RCPT TO:<${receiverEmail}>\r\n`);
    await sendCommand('DATA\r\n');
    sendCommand(`Subject:${subject}\r\n`);
    sendCommand('\r\n');
    sendCommand(`${message}\r\n`);
    await sendCommand('.\r\n');
    await sendCommand('QUIT\r\n');

    res.status(200).json({ message: 'E-posta başarıyla gönderildi!' });
  } catch (error) {
    console.error('Komut gönderme hatası: ', error);
    res.status(500).json({ error: 'E-posta gönderme hatası' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

