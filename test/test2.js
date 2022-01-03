
describe('Test Amazon', () => {
  it('Amazon should respond with 400', async () => {
    const res = await get('https://amazon.com');
    expect(res.status).toBe(200);
  });
});
