import { Notification } from "../types/notification";
import { logger } from "./logger";

const DEFAULT_BASE = "http://20.207.122.201/evaluation-service";

interface Params {
    limit?: number;
    page?: number;
    notification_type?: string;
}

function getApiBase(): string {
    return process.env.NEXT_PUBLIC_API_BASE || DEFAULT_BASE;
}

function getToken(): string {
    return process.env.NEXT_PUBLIC_ACCESS_TOKEN || "";
}

export async function fetchNotifications(params: Params = {}): Promise<Notification[]> {
    const token = getToken();
    if (!token) {
        logger.error("API", "Missing access token. Set NEXT_PUBLIC_ACCESS_TOKEN in .env.local.");
        throw new Error("Missing access token");
    }

    const query = new URLSearchParams();
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    if (params.notification_type) query.set("notification_type", params.notification_type);

    const url = `${getApiBase().replace(/\/$/, "")}/notifications?${query.toString()}`;
    logger.info("API", "Fetching notifications", { ...params });

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        logger.error("API", "Request failed", { status: res.status });
        throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const notifications = Array.isArray(data.notifications) ? data.notifications : [];
    logger.info("API", "Success", { count: notifications.length });
    return notifications;
}
