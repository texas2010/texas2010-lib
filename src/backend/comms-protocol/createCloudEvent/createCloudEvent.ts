import { CloudEventCustom } from '../utils/cloudEventCustom.js';
import type { CloudEventBaseParams } from '../types/CloudEventBaseParams.js';

export const createCloudEvent = (params: CloudEventBaseParams) => {
  return new CloudEventCustom(params);
};
