describe('Basic test setup', () => {
  test('true is truthy', () => {
    expect(true).toBe(true);
  });
  
  test('false is not truthy', () => {
    expect(false).toBe(false);
  });
  
  test('basic math works', () => {
    expect(1 + 1).toBe(2);
  });
}); 