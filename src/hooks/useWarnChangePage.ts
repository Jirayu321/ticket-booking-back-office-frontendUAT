import { useEffect } from "react";

export function useWarnChangePage(
  warningMessage: string = "คุณต้องการออกจากหน้านี้หรือไม่?"
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault(); 
      return warningMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [warningMessage]);
}
