import { CloudEvent } from 'cloudevents';

import type { ServiceLocations } from '../constants/serviceLocations/serviceLocations.js';
import type { CloudEventBaseParamsWithPayload } from '../types/CloudEventBaseParams.js';

class CloudEventBase<T = undefined> extends CloudEvent<T> {
  declare destination: ServiceLocations;

  constructor({
    source,
    destination,
    type,
    payload,
  }: CloudEventBaseParamsWithPayload<T>) {
    super({
      specversion: '1.0',
      source,
      type,
      destination,
      ...(payload !== undefined ? { data: payload } : {}),
    });
  }
}

export class CloudEventCustom<T = undefined> extends CloudEventBase<T> {
  constructor(params: CloudEventBaseParamsWithPayload<T>) {
    super(params);
  }
}
