import { Mongodb } from './mongodb';

describe('Mongodb', () => {
  it('should be defined', () => {
    expect(new Mongodb()).toBeDefined();
  });
});
