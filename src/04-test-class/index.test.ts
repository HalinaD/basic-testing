import { getBankAccount, BankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 199;
    const result = getBankAccount(initialBalance);
    expect(result.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const result = new BankAccount(199);
    expect(() => result.withdraw(299)).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const resultFirstAccount = new BankAccount(199);
    const resultSecondAccount = new BankAccount(0);
    expect(() => resultFirstAccount.transfer(299, resultSecondAccount)).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const result = new BankAccount(199);
    expect(() => result.transfer(299, result)).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    const result = new BankAccount(199);
    result.deposit(299)
    expect(result.getBalance()).toBe(498);
  });

  test('should withdraw money', () => {
    const result = new BankAccount(199);
    result.withdraw(99)
    expect(result.getBalance()).toBe(100);
  });

  test('should transfer money', () => {
    const resultFirstAccount = new BankAccount(199);
    const resultSecondAccount = new BankAccount(0);
    resultFirstAccount.transfer(99, resultSecondAccount);
    expect(resultFirstAccount.getBalance()).toBe(100);
    expect(resultSecondAccount.getBalance()).toBe(99);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const mockFetchBalance = jest.fn().mockResolvedValue(29);
    const result = new BankAccount(199);
    result.fetchBalance = mockFetchBalance;
    const balance = await result.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockFetchBalance = jest.fn().mockResolvedValue(19);
    const result = new BankAccount(199);
    result.fetchBalance = mockFetchBalance;
    await result.synchronizeBalance();
    const balance = result.getBalance();
    expect(typeof balance).toBe('number');
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
      const mockFetchBalance = jest.fn().mockResolvedValueOnce(null);
      const result = new BankAccount(199);
      result.fetchBalance = mockFetchBalance;
      await expect(result.synchronizeBalance()).rejects.toThrowError(SynchronizationFailedError);
  });
});
