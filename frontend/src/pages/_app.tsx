import type { AppProps } from "next/app";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import NavBar from "../components/NavBar";
import "../styles/globals.css";

const theme = createTheme({
    palette: {
        primary: { main: "#1565c0" },
        secondary: { main: "#2e7d32" },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
