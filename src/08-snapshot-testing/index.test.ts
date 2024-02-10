import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const values = [1, 2, 3];
    const result = generateLinkedList(values);
    expect(result).toMatchSnapshot();
  });

  test('should generate linked list from values 2', () => {
    const values = [4, 5, 6];
    const result = generateLinkedList(values);
    expect(result).toMatchSnapshot();
  });
});