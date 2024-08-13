import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface DateTimePickerComponentProps {
  label?: string;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  controlledValue?: Dayjs | null;
}

const DateTimePickerComponent: React.FC<DateTimePickerComponentProps> = ({
  label = "Select Date & Time",
  defaultValue = dayjs(),
  onChange,
  controlledValue,
}) => {
  const [value, setValue] = useState<Dayjs | null>(controlledValue || defaultValue);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>    
      <DateTimePicker
        label={label}
        value={value}
        onChange={handleChange}
        ampm={false}  // Use 24-hour format
        renderInput={(params) => <input {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
