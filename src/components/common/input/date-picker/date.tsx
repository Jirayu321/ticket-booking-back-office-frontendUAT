// import * as React from 'react';
// import { Stack, TextField } from '@mui/material';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';
// import 'dayjs/locale/th'; // Import Thai locale for Dayjs

// const StartEndDatePickers: React.FC<{
//   startDate: Dayjs | null;
//   endDate: Dayjs | null;
//   onStartDateChange: (date: Dayjs | null) => void;
//   onEndDateChange: (date: Dayjs | null) => void;
// }> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
//       <Stack direction="row" spacing={2}>
//         <DatePicker
//           label="วันที่เริ่มต้น"
//           value={startDate}
//           onChange={(newValue) => {
//             onStartDateChange(newValue);
//           }}
//           format="DD/MM/YYYY"
//           renderInput={(params) => <TextField {...params} />}
//           sx={{
//             '& .MuiOutlinedInput-root': {
//               '& input': {
//                 border: 'none', // Remove the inner border
//                 transform: 'translateY(5px)',
//               },
//             },
//           }}
//         />
//         <DatePicker
//           label="วันที่สิ้นสุด"
//           value={endDate}
//           onChange={(newValue) => {
//             onEndDateChange(newValue);
//           }}
//           format="DD/MM/YYYY"
//           renderInput={(params) => <TextField {...params} />}
//           sx={{
//             '& .MuiOutlinedInput-root': {
//               '& input': {
//                 border: 'none', // Remove the inner border
//                 transform: 'translateY(5px)',
//               },
//             },
//           }}
//         />
//       </Stack>
//     </LocalizationProvider>
//   );
// };

// export default StartEndDatePickers;

import React from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th'; // Import Thai locale for Dayjs

dayjs.extend(buddhistEra);

const StartEndDatePickers: React.FC<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {

  // Function to handle the input change and convert the value back to Dayjs
  const handleDateChange = (date: string, callback: (date: Dayjs | null) => void) => {
    if (date) {
      const [day, month, year] = date.split('/');
      // Convert the Buddhist year to the Gregorian year
      const gregorianYear = (parseInt(year) - 543).toString();
      const gregorianDate = `${gregorianYear}-${month}-${day}`;
      callback(dayjs(gregorianDate, 'YYYY-MM-DD'));
    } else {
      callback(null);
    }
  };

  // Function to format Dayjs date to Buddhist Year
  const formatToBuddhistYear = (date: Dayjs | null) => {
    return date ? date.add(543, 'year').format('DD/MM/YYYY') : '';
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div>
        <label style={{ color: 'black' }}>วันที่เริ่มต้น</label>
        <input
          type="text"
          value={formatToBuddhistYear(startDate)}
          onChange={(e) => handleDateChange(e.target.value, onStartDateChange)}
          placeholder="DD/MM/BBBB"
          style={{ padding: '5px', fontSize: '16px', color: 'black' }}
        />
      </div>
      <div>
        <label style={{ color: 'black' }}>วันที่สิ้นสุด</label>
        <input
          type="text"
          value={formatToBuddhistYear(endDate)}
          onChange={(e) => handleDateChange(e.target.value, onEndDateChange)}
          placeholder="DD/MM/BBBB"
          style={{ padding: '5px', fontSize: '16px', color: 'black' }}
        />
      </div>
    </div>
  );
};

export default StartEndDatePickers;


