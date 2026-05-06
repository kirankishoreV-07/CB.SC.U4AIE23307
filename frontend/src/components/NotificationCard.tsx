import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Notification } from "../types/notification";
import { isRead, markAsRead } from "../utils/readStorage";
import { logger } from "../utils/logger";

const COLORS: Record<string, string> = {
    Placement: "#1565c0",
    Result: "#2e7d32",
    Event: "#e65100",
};

export default function NotificationCard({ n }: { n: Notification }) {
    const [read, setRead] = useState(false);

    useEffect(() => {
        setRead(isRead(n.ID));
    }, [n.ID]);

    const handleClick = () => {
        if (!read) {
            markAsRead(n.ID);
            setRead(true);
            logger.info("UI", "Notification viewed", { id: n.ID, type: n.Type });
        }
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                mb: 2,
                cursor: "pointer",
                borderLeft: `4px solid ${read ? "#bdbdbd" : COLORS[n.Type]}`,
                opacity: read ? 0.72 : 1,
                transition: "all 0.2s ease",
                "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, flexWrap: "wrap", gap: 1 }}>
                    <Chip
                        label={n.Type}
                        size="small"
                        sx={{ bgcolor: COLORS[n.Type], color: "#fff", fontWeight: 600 }}
                    />
                    {!read && <Chip label="NEW" size="small" color="error" variant="outlined" />}
                </Box>
                <Typography variant="body1" fontWeight={read ? 400 : 700} mb={0.5}>
                    {n.Message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {new Date(n.Timestamp.replace(" ", "T")).toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    );
}
