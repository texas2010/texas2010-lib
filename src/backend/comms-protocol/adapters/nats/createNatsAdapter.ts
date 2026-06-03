import type { NatsConnection } from 'nats';
import type { ServiceLocations } from '../../constants/serviceLocations/serviceLocations.js';
import { requestJSON } from './requestJSON.js';

export const createNatsAdapter = (natsConnection: NatsConnection) => ({
  // nats connection
  natsConnection,

  //requestJSON
  requestJSON: <TReq, TRes>(subject: ServiceLocations, data: TReq) =>
    requestJSON<TReq, TRes>(natsConnection, subject, data),
});
