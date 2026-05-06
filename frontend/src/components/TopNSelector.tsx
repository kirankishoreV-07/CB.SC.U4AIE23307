import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface Props {
    value: number;
    onChange: (value: number) => void;
}

export default function TopNSelector({ value, onChange }: Props) {
    return (
        <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Show Top N</InputLabel>
            <Select
                value={value}
                label="Show Top N"
                onChange={(event) => onChange(Number(event.target.value))}
            >
                {[10, 15, 20].map((n) => (
                    <MenuItem key={n} value={n}>
                        Top {n}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
