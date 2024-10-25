import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface DatePickerProps {
  dateTimeValue: string;
  setter: (value: string) => void;
  label: string;
  allowPast?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ dateTimeValue, setter, label, allowPast = false }) => {
  const handleDateChange = (newValue: any) => {
    if (newValue) {
      const localFormattedDate = dayjs(newValue).format();
      setter(localFormattedDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={dayjs(dateTimeValue)}
        onChange={handleDateChange}
        ampm={false}
        format="DD/MM/YYYY HH:mm"
        // disablePast={!allowPast}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& input': {
              border: 'none',
              transform: 'translateY(5px)',
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
