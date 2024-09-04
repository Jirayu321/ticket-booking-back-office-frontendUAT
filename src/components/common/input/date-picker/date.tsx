import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Stack, TextField, Button } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

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
            renderInput={(params) => <TextField {...params} />}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent", // Remove the border
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Remove the border on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Remove the border when focused
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
            renderInput={(params) => <TextField {...params} />}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent", // Remove the border
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Remove the border on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Remove the border when focused
                },
              },
            }}
          />
        </Stack>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default StartEndDatePickers
