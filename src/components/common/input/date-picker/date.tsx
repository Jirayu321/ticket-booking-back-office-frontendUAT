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

import * as React from 'react';
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
  
  // Handle the date change and convert to Dayjs
  const handleDateChange = (date: string, callback: (date: Dayjs | null) => void) => {
    const newDate = date ? dayjs(date).subtract(543, 'year') : null;
    callback(newDate);
  };

  // Convert Gregorian date to Buddhist date for display
  const convertToBuddhistYear = (date: Dayjs | null) => {
    return date ? dayjs(date).add(543, 'year').format('YYYY-MM-DD') : '';
  };

  // Convert Buddhist date to display format
  const convertToDisplayFormat = (date: string) => {
    const [year, month, day] = date.split('-');
    const buddhistYear = parseInt(year, 10) + 543;
    return `${buddhistYear}-${month}-${day}`;
  };

  // Convert display format to Buddhist date
  const convertToInputFormat = (date: string) => {
    const [year, month, day] = date.split('-');
    const gregorianYear = parseInt(year, 10) - 543;
    return `${gregorianYear}-${month}-${day}`;
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div>
        <label style={{color:"black"}}>วันที่เริ่มต้น</label>
        <input
          type="date"
          value={startDate ? convertToDisplayFormat(convertToBuddhistYear(startDate)) : ''}
          onChange={(e) => handleDateChange(convertToInputFormat(e.target.value), onStartDateChange)}
          style={{ padding: '5px', fontSize: '16px' ,color:"black"}}
        />
      </div>
      <div>
        <label style={{color:"black"}}>วันที่สิ้นสุด</label>
        <input
          type="date"
          value={endDate ? convertToDisplayFormat(convertToBuddhistYear(endDate)) : ''}
          onChange={(e) => handleDateChange(convertToInputFormat(e.target.value), onEndDateChange)}
          style={{ padding: '5px', fontSize: '16px',color:"black" }}
        />
      </div>
    </div>
  );
};

export default StartEndDatePickers;