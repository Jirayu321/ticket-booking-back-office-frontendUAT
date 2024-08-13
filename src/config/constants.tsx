export const tableInputMethodOptions = (seatNumber: number, selectedZoneName: string) => [
    { value: "1", label: "1.คีย์เลขโต๊ะได้เอง" },
    { value: "2", label: `2.รันจาก  ${seatNumber} ถึง ${seatNumber}` },
    { value: "3", label: `3.นำหน้าด้วย ${selectedZoneName} ต่อด้วย รันจาก 1 ถึง ${seatNumber} - (${selectedZoneName} 1- ${selectedZoneName} ${seatNumber})` },
    { value: "4", label: `4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง ${seatNumber} ([?] 1- [?] ${seatNumber})` },
    { value: "5", label: "5.ไม่ระบุเลขโต๊ะ" },
  ];