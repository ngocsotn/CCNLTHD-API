const fs = require('fs').promises;
const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

module.exports.getAttachments = [
	{
		filename: 'logo.png',
		path: './public/html/img/logo.png',
		cid: 'main'
	}
];

module.exports.loadHTML = async () => {
	let path = '../../public/html/email_button.html';

	const filename = require.resolve(path);
	const rs = await fs.readFile(filename, 'utf-8');

	return rs;
};

module.exports.replaceHTML = async (title, content_1, content_2, button, button_url) => {
	let html = await this.loadHTML();
	html = html.replace('{Re_Home_URL}', process.env.CLIENT_URL);
	html = html.replace('{Re_About_URL}', process.env.CLIENT_URL);
	html = html.replace('{Re_Image}', process.env.SENDINBLUE_LOGO_URL);
	html = html.replace('{Re_Title}', title);
	html = html.replace('{Re_Content_1}', content_1);
	html = html.replace('{Re_Content_2}', content_2);
	html = html.replace('{Re_Thanks_Message}', 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của EzBid');

	if (button !== '') {
		html = html.replace('{Re_Button}', button);
		html = html.replace('{Re_Button_URl}', button_url);
		html = html.replace('{Re_Display}', 'block');
	} else {
		html = html.replace('{Re_Display}', 'none');
	}

	return html;
};

module.exports.send = async (subject, to_email, to_name, html) => {
	sendSmtpEmail.to = [ { email: to_email, name: to_name } ];
	sendSmtpEmail.sender = { email: process.env.SENDINBLUE_FROM_EMAIL, name: process.env.SENDINBLUE_FROM_NAME };
	sendSmtpEmail.htmlContent = html;
	sendSmtpEmail.subject = subject;
	// sendSmtpEmail.headers = { 'x-mailin-custom': 'myV3Custom' };
	// sendSmtpEmail.tags = [ 'myTag1', 'myTag2' ];
	// sendSmtpEmail.attachment = [
	// 	{
	// 		url: process.env.SENDINBLUE_LOGO_URL,
	// 		name: 'main.png'
	// 	}
	// ];

	apiInstance.sendTransacEmail(sendSmtpEmail).then(
		function(data) {
			console.log('API called successfully. Returned data: ' + data);
		},
		function(error) {
			console.error(error);
		}
	);
};
