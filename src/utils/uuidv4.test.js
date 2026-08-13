import uuidv4 from './uuidv4';

describe('uuidv4', () => {
  const originalCrypto = global.crypto;
  let sequence;
  let cryptoApi;

  beforeEach(() => {
    sequence = 0;
    cryptoApi = {
      getRandomValues: (bytes) => {
        bytes.fill(sequence++);
        return bytes;
      },
    };
  });

  afterEach(() => {
    global.crypto = originalCrypto;
  });

  it('uses the global Web Crypto API by default', () => {
    global.crypto = cryptoApi;

    expect(uuidv4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('generates an RFC 9562 version 4 UUID', () => {
    expect(uuidv4(cryptoApi)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('generates unique values', () => {
    expect(uuidv4(cryptoApi)).not.toBe(uuidv4(cryptoApi));
  });

  it('uses native randomUUID when available', () => {
    const expected = '00000000-0000-4000-8000-000000000000';
    cryptoApi.randomUUID = jest.fn(() => expected);
    cryptoApi.getRandomValues = jest.fn();

    expect(uuidv4(cryptoApi)).toBe(expected);
    expect(cryptoApi.randomUUID).toHaveBeenCalledTimes(1);
    expect(cryptoApi.getRandomValues).not.toHaveBeenCalled();
  });

  it('requires Web Crypto', () => {
    expect(() => uuidv4(null)).toThrow('crypto.getRandomValues() not supported');
  });
});
