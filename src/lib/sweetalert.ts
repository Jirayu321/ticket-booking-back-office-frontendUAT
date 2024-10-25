import Swal from "sweetalert2";

export function SwalError(message: string) {
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: message,
  });
}

export async function SwalConfirmDialog(message: string) {
  const result = await Swal.fire({
    icon: "success",
    title: message,
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });

  return result.isConfirmed;
}

export async function SwalConfirmAction(message: string) {
  const result = await Swal.fire({
    icon: "warning",
    title: "คำเตือน",
    text: message,
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  });

  return result.isConfirmed;
}

export async function SwalSuccess(message: string) {
  Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    text: message
  });
}
