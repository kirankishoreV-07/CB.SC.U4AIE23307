import { logger } from "./logger";

const KEY = "readNotifications";

export function getReadIds(): string[] {
    if (typeof window === "undefined") {
        return [];
    }

    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}

export function markAsRead(id: string): void {
    const ids = new Set(getReadIds());
    ids.add(id);
    localStorage.setItem(KEY, JSON.stringify([...ids]));
    logger.info("STORAGE", "Marked as read", { id });
}

export function isRead(id: string): boolean {
    return getReadIds().includes(id);
}
