export default class SendGridProvider {
  name = 'SendGridMock';
  async send({ to }) {
    await new Promise(r => setTimeout(r, 120));
    if (Math.random() < 0.3) throw new Error('SG fail');
    console.log(`[SendGrid] delivered → ${to}`);
  }
}