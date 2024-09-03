import Swal from "sweetalert2";

export function SwalError(message: string) {
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: message,
  });
}