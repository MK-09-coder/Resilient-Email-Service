import EmailService from '../src/core/emailService.js';

class AlwaysFail {
  name = 'Failer';
  async send() { throw new Error('nope'); }
}
class AlwaysPass {
  name = 'Passer';
  async send() { /* success */ }
}

describe('EmailService', () => {
  it('falls back to second provider', async () => {
    const svc = new EmailService([new AlwaysFail(), new AlwaysPass()], 1);
    const email = { id: 'abc', to: 'x@y.z', subject: 'hi', html: '<p>yo</p>' };
    await svc.send(email);
    expect(svc.getStatus('abc')).toBe('SENT_WITH_Passer');
  });

  it('enforces rate limiting', async () => {
    const svc = new EmailService([new AlwaysPass()], 1);
    const gen = i => ({ id: String(i), to: 't', subject: 's', html: 'h' });
    for (let i = 0; i < 20; i++) await svc.send(gen(i));
    await expect(svc.send(gen(21))).rejects.toThrow('Rate limit exceeded');
  });
});
