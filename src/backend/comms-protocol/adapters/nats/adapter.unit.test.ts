import { test, expect, describe, vi, beforeEach, afterEach } from 'vitest';

import { createCloudMessage } from '../../createCloudMessage/createCloudMessage.js';

vi.mock('nats', async (importOriginal) => {
  const actual = await importOriginal<typeof import('nats')>();
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue({
      close: vi.fn(),
    }),
  };
});

import * as nats from 'nats';
import { createNatsAdapter } from './adapter.js';

beforeEach(vi.clearAllMocks);
afterEach(vi.restoreAllMocks);

describe('createNatsAdapter', () => {
  test('should return an adapter with the same connection', async () => {
    const nc = await nats.connect({ servers: 'nats://localhost:4222' });

    const adapter = createNatsAdapter(nc);

    expect(nats.connect).toHaveBeenCalledOnce();
    expect(adapter.natsConnection).toBe(nc);
  });

  test('Should have a requestJSON in the object', async () => {
    const nc = await nats.connect({ servers: 'nats://localhost:4222' });

    const adapter = createNatsAdapter(nc);

    expect(adapter).toHaveProperty('requestJSON');
    expect(typeof adapter.requestJSON).toBe('function');
    expect(adapter.requestJSON).toBeDefined();
  });

  describe('requestJSON method', () => {
    test('Should have a subject and data', async () => {
      const eventRes = createCloudMessage({
        source: 'service.database',
        destination: 'service.api',
        type: 'timer.created.success',
        payload: {
          success: true,
          status: 201,
          message: 'Timer created successfully',
        },
      });

      (nats.connect as any).mockResolvedValueOnce({
        request: vi.fn().mockResolvedValue({
          data: new TextEncoder().encode(JSON.stringify(eventRes)),
        }),
      });

      const nc = await nats.connect({ servers: 'nats://localhost:4222' });
      const adapter = createNatsAdapter(nc);

      const eventReq = createCloudMessage({
        source: 'service.api',
        destination: 'service.database',
        type: 'timer.create.request',
        payload: {
          timerName: 'Test Test',
          timerNum: 55555,
        },
      });

      const res = await adapter.requestJSON<typeof eventReq, typeof eventRes>(
        eventReq.destination,
        eventReq
      );

      expect(eventRes).toMatchObject(res);
    });
  });
});
