import { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, Chip, Alert, Skeleton } from "@mui/material";
import { fetchNotifications } from "../utils/api";
import { getTopN, computeScore } from "../utils/priorityScore";
import { Notification } from "../types/notification";
import { markAsRead } from "../utils/readStorage";
import TopNSelector from "../components/TopNSelector";
import { logger } from "../utils/logger";

const COLORS: Record<string, string> = {
    Placement: "#1565c0",
    Result: "#2e7d32",
    Event: "#e65100",
};

export default function PriorityInbox() {
    const [topN, setTopN] = useState(10);
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        void load();
    }, [topN]);

    async function load() {
        setLoading(true);
        setError("");
        logger.info("UI", "Loading priority inbox", { topN });

        try {
            const data = await fetchNotifications({ limit: 50 });
            setItems(getTopN(data, topN));
        } catch (err) {
            setError("Unable to load priority notifications.");
            logger.error("UI", "Priority inbox load failed", { message: (err as Error).message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, gap: 2, flexWrap: "wrap" }}>
                <Typography variant="h4" fontWeight={700}>
                    Priority Inbox
                </Typography>
                <TopNSelector value={topN} onChange={setTopN} />
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
        Ranked by: Placement -> Result -> Event, then most recent first
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={90} sx={{ mb: 2, borderRadius: 1 }} />
                ))
                : items.map((n, i) => (
                    <Card
                        key={n.ID}
                        onClick={() => {
                            markAsRead(n.ID);
                            logger.info("UI", "Priority item viewed", { id: n.ID });
                        }}
                        sx={{
                            mb: 2,
                            cursor: "pointer",
                            borderLeft: `4px solid ${COLORS[n.Type]}`,
                            "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
                            transition: "all 0.2s ease",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                                <Box
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        bgcolor: COLORS[n.Type],
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        flexShrink: 0,
                                    }}
                                >
                                    {i + 1}
                                </Box>
                                <Chip
                                    label={n.Type}
                                    size="small"
                                    sx={{ bgcolor: COLORS[n.Type], color: "#fff", fontWeight: 600 }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                                    Score: {computeScore(n).toLocaleString()}
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight={600}>
                                {n.Message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(n.Timestamp.replace(" ", "T")).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
        </Container>
    );
}
