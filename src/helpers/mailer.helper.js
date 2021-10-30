const nodemailer = require('nodemailer');
const fs = require('fs').promises;

module.exports.getAttachments = [
	{
		filename: 'logo.png',
		path: './public/html/img/logo.png',
		cid: 'main'
	}
];

module.exports.loadHTML = async (pattern_type) => {
	let path = '../../public/html/email.html';

	if (pattern_type === 'button') {
		path = '../../public/html/email_button.html';
	}

	const filename = require.resolve(path);
	const rs = await fs.readFile(filename, 'utf-8');
	return rs;
};

module.exports.replaceHTML = async (title, content_1, content_2, button, button_url) => {
	const type = button === '' ? '' : 'button';
	let html = await this.loadHTML(type);
	html = html.replace('{Re_Image}', 'main');
	html = html.replace('{Re_Title}', title);

	return html;
};

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
