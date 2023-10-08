import { getPercent } from './number';

describe('test user service', () => {
  it('test getPercent', () => {
    expect(getPercent(0.123456)).toBe(0.1235);
  });
});
