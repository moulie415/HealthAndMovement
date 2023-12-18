import sleep from './sleep';

describe('sleep', () => {
  it('setTimeout should be called', async () => {
    jest.spyOn(global, 'setTimeout');
    await sleep(1);
    expect(setTimeout).toHaveBeenCalled();
  });

});
