import { Notification, NotificationType } from "./types";

const TYPE_WEIGHTS: Record<NotificationType, number> = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

export function computeScore(notification: Notification): number {
    const weight = TYPE_WEIGHTS[notification.Type];
    const timeMs = new Date(notification.Timestamp.replace(" ", "T")).getTime();

    return weight * 10_000_000_000_000 + timeMs;
}
