import { CloudEventCustom } from '../utils/cloudEventCustom.js';
import type { CloudEventBaseParamsWithPayload } from '../types/CloudEventBaseParams.js';

export const createCloudMessage = <T>(
  params: CloudEventBaseParamsWithPayload<T>
): CloudEventCustom<T> => {
  return new CloudEventCustom<T>(params);
};
