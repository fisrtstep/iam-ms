import { subscribe } from '../lib/events.js';
import { recordOrder } from '../users/repository.js';

export async function startConsumers() {
    await subscribe('iam-ms.events', {
        // { orderId, userId, total, currency, placedAt }
        'order.placed': (data, event) => recordOrder({ eventId: event.id, userId: data.userId, placedAt: data.placedAt }),
    });
}
