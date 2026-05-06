import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/router";

export default function NavBar() {
    const router = useRouter();

    return (
        <AppBar position="sticky" elevation={2}>
            <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
                <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Campus Notifications
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        color="inherit"
                        startIcon={<NotificationsIcon />}
                        onClick={() => router.push("/")}
                        variant={router.pathname === "/" ? "outlined" : "text"}
                    >
                        All
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<StarIcon />}
                        onClick={() => router.push("/priority")}
                        variant={router.pathname === "/priority" ? "outlined" : "text"}
                    >
                        Priority
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
