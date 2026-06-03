import { ServiceLocationList } from './servicesLocationList.js';

export const ServiceLocations = Object.fromEntries(
  Object.entries(ServiceLocationList).map(([k, v]) => [k, `service.${v}`]),
) as {
  [K in keyof typeof ServiceLocationList]: `service.${(typeof ServiceLocationList)[K]}`;
};

export type ServiceLocations =
  (typeof ServiceLocations)[keyof typeof ServiceLocations];
