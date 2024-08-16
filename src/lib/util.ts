const BC_YEAR = 543;

export function formatThaiDate({
  date,
  option = "date",
}: {
  date: string;
  option: "date" | "datetime";
}) {
  const newDate = new Date(date);
  if (option === "date") {
    return `${newDate.getDate().toString().padStart(2, "0")}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${newDate.getFullYear() + BC_YEAR}`;
  }

  return `${newDate.getDate().toString().padStart(2, "0")}/${(
    newDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${newDate.getFullYear() + BC_YEAR} ${newDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}`;
}
