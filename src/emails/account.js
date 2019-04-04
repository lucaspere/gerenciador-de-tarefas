const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const enviarEmail = (email, name) => {
   sgmail.send({
      to: email,
      from: 'lucasfapereira@gmail.com',
      subject: 'Bem-vindo ao meu primeiro aplicativo 🤗',
      text: `Obrigado ${name} por participar do nosso teste. Ficamos felizes com a sua participação 😄`,
   })
}

module.exports = {
   enviarEmail
}