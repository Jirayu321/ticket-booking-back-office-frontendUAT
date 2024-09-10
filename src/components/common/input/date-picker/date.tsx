import * as React from 'react';
import { Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb'; // Import the en-gb locale

const StartEndDatePickers: React.FC<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th-gb">
      <Stack direction="row" spacing={2}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            onStartDateChange(newValue);
          }}
          format="DD/MM/YYYY"
          renderInput={(params) => <TextField {...params} />}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& input': {
                border: 'none', // Remove the inner border
                transform: 'translateY(5px)',
              },
            },
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            onEndDateChange(newValue);
          }}
          format="DD/MM/YYYY"
          renderInput={(params) => <TextField {...params} />}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& input': {
                border: 'none', // Remove the inner border
                transform: 'translateY(5px)',
              },
            },
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default StartEndDatePickers;
