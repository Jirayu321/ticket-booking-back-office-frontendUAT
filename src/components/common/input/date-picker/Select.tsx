import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
} from "@mui/material";
import { FC } from "react";

type Value = any;

type SelectProps = {
  value: Value;
  setter: (value: Value) => void;
  options: Value[];
  optionValues: Value[];
  placeholder?: string;
  disabled?: boolean;
};

const Select: FC<SelectProps> = ({
  placeholder = "เลือก",
  value,
  setter,
  options,
  disabled = false,
  optionValues,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <MUISelect
        disabled={disabled}
        label={placeholder}
        onChange={(e: any) => setter(e.target.value)}
        value={value}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={optionValues[index]}>
            {option}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
};

export default Select;
