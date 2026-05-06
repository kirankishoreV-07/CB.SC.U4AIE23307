import { Notification } from "../types/notification";
import { logger } from "./logger";

const WEIGHTS = { Placement: 3, Result: 2, Event: 1 } as const;

export function computeScore(notification: Notification): number {
    const weight = WEIGHTS[notification.Type] ?? 1;
    const timeMs = new Date(notification.Timestamp.replace(" ", "T")).getTime();
    return weight * 10_000_000_000_000 + timeMs;
}

export function getTopN(notifications: Notification[], n: number): Notification[] {
    logger.info("PRIORITY", "Sorting for top N", { n, total: notifications.length });
    return [...notifications]
        .sort((a, b) => computeScore(b) - computeScore(a))
        .slice(0, n);
}
