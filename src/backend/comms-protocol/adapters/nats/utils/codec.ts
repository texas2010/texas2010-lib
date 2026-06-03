import { StringCodec } from 'nats';

export const sc = StringCodec();

export const encodeJSON = <T>(data: T): Uint8Array =>
  sc.encode(JSON.stringify(data));

export const decodeJSON = <T>(data: Uint8Array): T =>
  JSON.parse(sc.decode(data)) as T;
