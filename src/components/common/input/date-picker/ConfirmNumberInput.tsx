import { Button, Stack } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  setter: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
  placeholder?: string;
};

const ConfirmNumberInput: FC<Props> = ({
  setter,
  value,
  min = 0,
  max = 1000,
  placeholder = "",
}) => {
  const [tempValue, setTempValue] = useState(value);
  return (
    <Stack direction={"row"}>
      <input
        onFocus={(e) => e.target.select()}
        type="number"
        min={min}
        placeholder={placeholder}
        style={{ backgroundColor: "white", color: "black" }}
        value={tempValue || 0}
        onChange={(e) => {
          if (Number(e.target.value) > max) {
            return;
          }
          setTempValue(Number(e.target.value));
        }}
      />
      <Button
        color="success"
        variant="contained"
        onClick={() => {
          setter(tempValue);
        }}
      >
        ยืนยัน
      </Button>
    </Stack>
  );
};

export default ConfirmNumberInput;
