export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
    ID: string;
    Type: NotificationType;
    Message: string;
    Timestamp: string;
}

export interface ScoredNotification {
    notification: Notification;
    score: number;
}
