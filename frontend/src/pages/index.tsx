import { useState, useEffect } from "react";
import { Container, Typography, Skeleton, Alert, Pagination, Box } from "@mui/material";
import { fetchNotifications } from "../utils/api";
import { Notification } from "../types/notification";
import NotificationCard from "../components/NotificationCard";
import TypeFilterBar from "../components/TypeFilterBar";
import { logger } from "../utils/logger";

const LIMIT = 10;

export default function AllNotifications() {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        void load();
    }, [page, filter]);

    async function load() {
        setLoading(true);
        setError("");
        logger.info("UI", "Loading notifications page", { page, filter });

        try {
            const params: { limit: number; page: number; notification_type?: string } = { limit: LIMIT, page };
            if (filter !== "All") {
                params.notification_type = filter;
            }

            const data = await fetchNotifications(params);
            setItems(data);
            setTotalPages(data.length < LIMIT ? page : page + 1);
        } catch (err) {
            setError("Unable to load notifications. Please try again.");
            logger.error("UI", "Failed to load notifications", { message: (err as Error).message });
        } finally {
            setLoading(false);
        }
    }

    const handleFilter = (type: string) => {
        setFilter(type);
        setPage(1);
        logger.info("UI", "Filter changed", { type });
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={3}>
                All Notifications
            </Typography>

            <TypeFilterBar selected={filter} onChange={handleFilter} />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={90} sx={{ mb: 2, borderRadius: 1 }} />
                ))
                : items.length === 0
                    ? (
                        <Alert severity="info">No notifications found for this filter.</Alert>
                    )
                    : items.map((n) => <NotificationCard key={n.ID} n={n} />)}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
        </Container>
    );
}
