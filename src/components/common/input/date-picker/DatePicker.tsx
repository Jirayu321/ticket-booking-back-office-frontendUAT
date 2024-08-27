import { FC } from "react";
import { formatISOToLocalTime } from "../../../../lib/util";
import styles from "./date-picker.module.css";

const TIME_DIFFERENCE = 7 * 60 * 60 * 1000; // 7 hours

type DatePickerProps = {
  dateTimeValue: string;
  setter: (value: string) => void;
  label: string;
  allowPast?: boolean;
};

const DatePicker: FC<DatePickerProps> = ({
  dateTimeValue,
  label,
  setter,
  allowPast = false,
}) => {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <input
        type="datetime-local"
        value={formatISOToLocalTime(dateTimeValue)}
        onInputCapture={(e: any) => {

          if (!allowPast && new Date(e.target.value).getTime() <= Date.now()) {
            return;
          }

          const date = new Date(e.target.value);

          const localTime = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000 + TIME_DIFFERENCE
          )
            .toISOString()
            .slice(0, 16);

          setter(localTime);
        }}
      />
    </div>
  );
};

export default DatePicker;
