
describe('Test Google', () => {
  beforeAll(async () => {
    await get('https://google.com');
  });
  afterAll(async () => {
    await get('https://google.com');
  });
  it('Google should respond with 200', async () => {
    const res = await get('https://www.google.com/');
    expect(res.status).toBe(200);
  });

  it('Google should respond with 400', async () => {
    const res = await get('https://google.com');
    expect(res.status).toBe(400);
  });
});
