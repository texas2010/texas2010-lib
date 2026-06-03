import { Entities } from './entitles.js';
import { Actions } from './actions.js';
import { Contexts } from './contexts.js';

export const CloudActionTypes = Object.fromEntries(
  Object.entries(Entities).flatMap(([ek, ev]) =>
    Object.entries(Actions).flatMap(([ak, av]) =>
      Object.entries(Contexts).map(([ck, cv]) => [
        `${ek}_${ak}_${ck}`,
        `${ev}.${av}.${cv}`,
      ]),
    ),
  ),
) as {
  [E in keyof typeof Entities as `${E}_${keyof typeof Actions & string}_${keyof typeof Contexts & string}`]: `${(typeof Entities)[E]}.${(typeof Actions)[keyof typeof Actions]}.${(typeof Contexts)[keyof typeof Contexts]}`;
};

export type CloudActionTypes =
  (typeof CloudActionTypes)[keyof typeof CloudActionTypes];
