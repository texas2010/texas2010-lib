import type { NatsConnection } from 'nats';
import type { ServiceLocations } from '../../constants/serviceLocations/serviceLocations.js';
import { encodeJSON, decodeJSON } from './utils/codec.js';

export const requestJSON = async <TReq, TRes>(
  natsConnection: NatsConnection,
  subject: ServiceLocations,
  data: TReq,
): Promise<TRes> => {
  const res = await natsConnection.request(subject, encodeJSON(data));
  return decodeJSON<TRes>(res.data);
};
