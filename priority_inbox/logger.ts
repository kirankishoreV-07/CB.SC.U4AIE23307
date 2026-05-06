type LogLevel = "INFO" | "WARN" | "ERROR";
type LogContext = "API" | "PRIORITY" | "STORAGE" | "UI" | "SYSTEM";

function formatTime(): string {
    return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(level: LogLevel, context: LogContext, message: string, meta?: Record<string, unknown>): void {
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
    process.stdout.write(`[${formatTime()}] [${level}] [${context}] ${message}${metaStr}\n`);
}

export const logger = {
    info: (context: LogContext, message: string, meta?: Record<string, unknown>) =>
        log("INFO", context, message, meta),
    warn: (context: LogContext, message: string, meta?: Record<string, unknown>) =>
        log("WARN", context, message, meta),
    error: (context: LogContext, message: string, meta?: Record<string, unknown>) =>
        log("ERROR", context, message, meta),
};
