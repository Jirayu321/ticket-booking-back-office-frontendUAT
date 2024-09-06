import { Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import * as React from 'react';

const StartEndDatePickers: React.FC<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => {
              onStartDateChange(newValue);
            }}
            format="DD/MM/YY"
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
            format="DD/MM/YY"
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
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default StartEndDatePickers;