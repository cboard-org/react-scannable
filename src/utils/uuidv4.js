const byteToHex = Array.from({ length: 256 }, (_, index) => (index + 0x100).toString(16).slice(1));
const randomBytes = new Uint8Array(16);

export default function uuidv4(cryptoApi = typeof crypto === 'undefined' ? undefined : crypto) {
  if (cryptoApi && cryptoApi.randomUUID) {
    return cryptoApi.randomUUID();
  }

  if (!cryptoApi || !cryptoApi.getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported');
  }

  const bytes = cryptoApi.getRandomValues(randomBytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return (
    byteToHex[bytes[0]] +
    byteToHex[bytes[1]] +
    byteToHex[bytes[2]] +
    byteToHex[bytes[3]] +
    '-' +
    byteToHex[bytes[4]] +
    byteToHex[bytes[5]] +
    '-' +
    byteToHex[bytes[6]] +
    byteToHex[bytes[7]] +
    '-' +
    byteToHex[bytes[8]] +
    byteToHex[bytes[9]] +
    '-' +
    byteToHex[bytes[10]] +
    byteToHex[bytes[11]] +
    byteToHex[bytes[12]] +
    byteToHex[bytes[13]] +
    byteToHex[bytes[14]] +
    byteToHex[bytes[15]]
  );
}
