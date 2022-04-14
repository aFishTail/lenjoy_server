import { loggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(loggerMiddleware).toBeDefined();
  });
});
