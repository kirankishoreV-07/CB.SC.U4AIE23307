import fs from "fs";
import path from "path";
import { computeScore } from "./scorer";
import { MinHeap } from "./minHeap";
import { Notification } from "./types";
import { logger } from "./logger";

const TOP_N = 10;

function loadEnvFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        return;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!match) {
            continue;
        }

        const key = match[1];
        let value = match[2].trim();
        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}

function loadEnv(): void {
    const repoRoot = path.resolve(__dirname, "..");
    loadEnvFile(path.join(repoRoot, ".env.local"));
    loadEnvFile(path.join(repoRoot, "frontend", ".env.local"));
}

async function fetchNotifications(apiBase: string, token: string): Promise<Notification[]> {
    const url = `${apiBase.replace(/\/$/, "")}/notifications`;
    logger.info("API", "Fetching notifications", { url });

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        logger.error("API", "Fetch failed", { status: res.status });
        throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as { notifications?: Notification[] };
    const notifications = Array.isArray(data.notifications) ? data.notifications : [];
    logger.info("API", "Fetch success", { count: notifications.length });
    return notifications;
}

function writeLine(text: string): void {
    process.stdout.write(`${text}\n`);
}

async function main(): Promise<void> {
    loadEnv();
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://20.207.122.201/evaluation-service";
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN || process.env.ACCESS_TOKEN || "";

    if (!token) {
        logger.error("SYSTEM", "Missing access token. Set NEXT_PUBLIC_ACCESS_TOKEN or ACCESS_TOKEN.");
        process.exitCode = 1;
        return;
    }

    const notifications = await fetchNotifications(apiBase, token);
    logger.info("PRIORITY", "Computing scores", { total: notifications.length });

    const heap = new MinHeap(TOP_N);
    for (const notification of notifications) {
        heap.insert({ notification, score: computeScore(notification) });
    }

    const top = heap.getTopN();
    logger.info("PRIORITY", `Top ${TOP_N} computed`, { first: top[0]?.notification.Message });

    writeLine("");
    writeLine(`Top ${TOP_N} Priority Notifications`);
    writeLine("=".repeat(62));

    top.forEach((item, index) => {
        const { notification, score } = item;
        writeLine(`${String(index + 1).padStart(2)}. [${notification.Type.padEnd(9)}] ${notification.Message}`);
        writeLine(`    Timestamp : ${notification.Timestamp}`);
        writeLine(`    Score     : ${score}`);
        writeLine("-".repeat(62));
    });
}

main().catch((error: Error) => {
    logger.error("SYSTEM", error.message);
    process.exitCode = 1;
});
