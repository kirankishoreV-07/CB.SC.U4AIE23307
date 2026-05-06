import { Box, Chip } from "@mui/material";

const TYPES = ["All", "Placement", "Result", "Event"];

interface Props {
    selected: string;
    onChange: (value: string) => void;
}

export default function TypeFilterBar({ selected, onChange }: Props) {
    return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {TYPES.map((type) => (
                <Chip
                    key={type}
                    label={type}
                    onClick={() => onChange(type)}
                    color={selected === type ? "primary" : "default"}
                    variant={selected === type ? "filled" : "outlined"}
                    sx={{ cursor: "pointer", fontWeight: selected === type ? 700 : 400 }}
                />
            ))}
        </Box>
    );
}
