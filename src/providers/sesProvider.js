export default class SESProvider {
  name = 'SESMock';
  async send({ to }) {
    await new Promise(r => setTimeout(r, 80));
    if (Math.random() < 0.25) throw new Error('SES fail');
    console.log(`[SES] delivered → ${to}`);
  }
}