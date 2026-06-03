import { test, expect, describe } from 'vitest';

import { createCloudEvent } from './createCloudEvent.js';

describe('createCloudEvent', () => {
  test('Should have a CloudEvent Object when it return', () => {
    const event = createCloudEvent({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
    });

    expect(event).toBeDefined();
    expect(event.constructor.name).toBe('CloudEventCustom');
  });

  test('Should have two different Events', () => {
    const eventA = createCloudEvent({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
    });
    const eventB = createCloudEvent({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
    });

    expect(eventA).not.toBe(eventB);
  });

  test('Should have source, destination, and type', () => {
    const event = createCloudEvent({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
    });

    expect(event).toBeDefined();
    expect(event).toMatchObject({
      source: 'service.api',
      destination: 'service.database',
      type: 'timer.create.request',
    });
  });
});
