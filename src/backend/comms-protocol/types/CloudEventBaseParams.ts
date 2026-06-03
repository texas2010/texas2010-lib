import type { ServiceLocations } from '../constants/serviceLocations/serviceLocations.js';
import type { CloudActionTypes } from '../constants/cloudActionTypes/cloudActionTypes.js';

export interface CloudEventBaseParams {
  source: ServiceLocations;
  destination: ServiceLocations;
  type: CloudActionTypes;
}

export interface CloudEventBaseParamsWithPayload<T>
  extends CloudEventBaseParams {
  payload?: T;
}
