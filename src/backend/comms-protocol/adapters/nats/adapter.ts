import { StringCodec } from 'nats';
import type { NatsConnection } from 'nats';
import type { ServiceLocations } from '../../constants/serviceLocations/serviceLocations.js';

export const createNatsAdapter = (natsConnection: NatsConnection) => {
  const sc = StringCodec();

  return {
    natsConnection,
    async requestJSON<TReq, TRes>(
      subject: ServiceLocations,
      data: TReq,
    ): Promise<TRes> {
      const res = await natsConnection.request(
        subject,
        sc.encode(JSON.stringify(data)),
      );
      return JSON.parse(sc.decode(res.data)) as TRes;
    },
  };
};
