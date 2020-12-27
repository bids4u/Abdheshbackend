var nodemailer = require('nodemailer');
module.exports = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type:'OAuth2',
        user: 'bidhanbabugupta@gmail.com',
        pass: 'ramhari123'
    }
});
