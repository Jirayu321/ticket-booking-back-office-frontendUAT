import Swal from "sweetalert2";

export function SwalError(message: string) {
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: message,
  });
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

export function SwalSuccess(message: string) {
  Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    text: message,
  });
}
