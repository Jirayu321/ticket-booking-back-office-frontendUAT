// import { FC } from "react";
// import { formatISOToLocalTime } from "../../../../lib/util";
// import styles from "./date-picker.module.css";
// import { convertISOToBuddhistDate } from "../../../../lib/utils/date.util";

// const TIME_DIFFERENCE = 7 * 60 * 60 * 1000; // 7 hours

// type DatePickerProps = {
//   dateTimeValue: string;
//   setter: (value: string) => void;
//   label: string;
//   allowPast?: boolean;
// };

// const DatePicker: FC<DatePickerProps> = ({
//   dateTimeValue,
//   label,
//   setter,
//   allowPast = false,
// }) => {
//   return (
//     <div className={styles.container}>
//       <label>{label}</label>
//       <input
//         type="datetime-local"
//         value={formatISOToLocalTime(dateTimeValue)}
//         onInputCapture={(e: any) => {
//           if (!allowPast && new Date(e.target.value).getTime() <= Date.now()) {
//             return;
//           }

//           const date = new Date(e.target.value);

//           const localTime = new Date(
//             date.getTime() - date.getTimezoneOffset() * 60000 + TIME_DIFFERENCE
//           )
//             .toISOString()
//             .slice(0, 16);

//           setter(convertISOToBuddhistDate(localTime));
//         }}
//       />
//     </div>
//   );
// };

// export default DatePicker;
// 

// import { FC } from "react";
// import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import styles from "./date-picker.module.css";

// dayjs.extend(customParseFormat);

// type DatePickerProps = {
//   dateTimeValue: string;
//   setter: (value: string) => void;
//   label: string;
//   allowPast?: boolean;
// };

// const DatePicker: FC<DatePickerProps> = ({
//   dateTimeValue,
//   label,
//   setter,
//   allowPast = false,
// }) => {
//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedDate = new Date(e.target.value);

//     // Check if past date selection is allowed
//     if (!allowPast && selectedDate.getTime() < Date.now()) {
//       return;
//     }

//     // Format the selected date and time in DD/MM/YYYY HH:mm (24-hour format)
//     const formattedDate = dayjs(selectedDate).format('M/D/YYYY HH:mm');
//     setter(formattedDate);
//   };

//   return (
//     <div className={styles.container}>
//       <label>{label}</label>
//       <input
//         type="datetime-local"
//         value={dayjs(dateTimeValue).format('YYYY-MM-DDTHH:mm')} // Ensure correct format for the input
//         onChange={handleDateChange}
//       />
//     </div>
//   );
// };

// export default DatePicker;


import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface DatePickerProps {
  dateTimeValue: string; // Expecting ISO string
  setter: (value: string) => void; // Setter function
  label: string;
  allowPast?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ dateTimeValue, setter, label, allowPast = false }) => {
  const handleDateChange = (newValue: any) => {
    if (newValue) {
      // Store the selected date directly as an ISO string in Zustand
      const isoFormattedDate = dayjs(newValue).toISOString();
      
      setter(isoFormattedDate); // Pass the ISO string to Zustand
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={dayjs(dateTimeValue)} // Parse the ISO string into a dayjs object for the picker
        onChange={handleDateChange}
        ampm={false} // 24-hour format
        format="DD/MM/YYYY HH:mm" // Display format for the picker
        disablePast={!allowPast} // Optionally disable past dates
        sx={{
          '& .MuiOutlinedInput-root': {
            '& input': {
              border: 'none', // Remove the inner border
              transform: 'translateY(5px)',
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
