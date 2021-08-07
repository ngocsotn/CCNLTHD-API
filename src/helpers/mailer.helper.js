const nodemailer = require('nodemailer');

module.exports.sendHtmlMail = async (toEmail, emailSubject, emailContent, yourCustomHTML, attach) => {
	const transporter = nodemailer.createTransport({
		host: process.env.MAILER_HOST,
		port: Number(process.env.MAILER_PORT),
		secure: false,
		auth: {
			user: process.env.MAILER_USERNAME,
			pass: process.env.MAILER_PASSWORD
		}
	});

	if (attach)
		return transporter.sendMail({
			from: process.env.MAILER_FROM_SENDER,
			to: toEmail,
			subject: emailSubject,
			text: emailContent,
			attachments: attach,
			html: yourCustomHTML
		});
	else {
		return transporter.sendMail({
			from: process.env.MAILER_FROM_SENDER,
			to: toEmail,
			subject: emailSubject,
			text: emailContent,
			html: yourCustomHTML
		});
	}
};
