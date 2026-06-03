import { test, expect, describe } from 'vitest';

import { createCloudMessage } from './createCloudMessage.js';

describe('createCloudMessage', () => {
  test('Should have a CloudEvent Object when it return', () => {
    const event = createCloudMessage({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
      payload: {},
    });

    expect(event).toBeDefined();
    expect(event.constructor.name).toBe('CloudEventCustom');
  });

  test('Should have two different Events', () => {
    const eventA = createCloudMessage({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
      payload: {},
    });
    const eventB = createCloudMessage({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
      payload: {},
    });

    expect(eventA).not.toBe(eventB);
  });

  test('Should have source, destination, type, and payload', () => {
    const event = createCloudMessage({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
      payload: {},
    });

    expect(event).toBeDefined();
    expect(event).toMatchObject({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
      data: {},
    });
  });
});
