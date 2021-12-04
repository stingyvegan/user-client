import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { getWebSocketObservable } from './wsController';

interface RegisteredSubscription {
  handler: (event: any) => void;
  subscriber: Subscription;
}
const currentSubscriptions: { [type: string]: Array<RegisteredSubscription> } =
  {};

function eventSubscription(event: string) {
  if (!currentSubscriptions[event]) {
    currentSubscriptions[event] = [];
  }
  return currentSubscriptions[event];
}

export function subscribe<T>(eventType: string, handler: (event: T) => void) {
  const obs = getWebSocketObservable();
  const subscriber = obs
    .pipe(filter((event) => event.type === eventType))
    .subscribe(handler);
  const eSub = eventSubscription(eventType);
  eSub.push({
    handler,
    subscriber,
  });
}

export function unsubscribe<T>(eventType: string, handler: (event: T) => void) {
  const eSub = eventSubscription(eventType);
  const record = eSub.findIndex((entry) => entry.handler === handler);
  if (record >= 0) {
    eSub[record].subscriber.unsubscribe();
    eSub.splice(record, 1);
    return true;
  }
  return false;
}
