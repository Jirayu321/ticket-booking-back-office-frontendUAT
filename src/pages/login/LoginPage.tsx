import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  FormControl,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { User, UserSchema } from "../../model/user.model";
import { login, loginPin } from "../../services/auth.service";
import styles from "./login-page.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:800px)");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(UserSchema),
  });

  // สำหรับ Mobile PIN
  const [pin, setPin] = useState<string>("");

  const handleDigitClick = async (digit: string) => {
    if (pin.length >= 6) return;

    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 6) {
      await handlePinLogin(newPin);
    }
  };
  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handlePinLogin = async (pinValue: string) => {
    if (pinValue.length !== 6) {
      toast.error("กรุณาใส่ PIN ให้ครบ 6 หลัก");
      return;
    }
    try {
      toast.loading("กำลังเข้าสู่ระบบ...");
      toast.dismiss();

      const token = await loginPin(pinValue);
      localStorage.setItem("token", token.token);
      localStorage.setItem("emmp", JSON.stringify(token));
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/dashboard-mabile");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "เข้าสู่ระบบล้มเหลว");
      setPin("");
    }
  };

  const onSubmit = async (data: User) => {
    try {
      toast.loading("กำลังเข้าสู่ระบบ...");
      toast.dismiss();
      const token = await login(data);
      localStorage.setItem("token", token.token);
      localStorage.setItem("emmp", JSON.stringify(token));
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/all-events");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "เข้าสู่ระบบล้มเหลว");
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} sx={{boxShadow: "none"}}>
        <Stack alignItems="center" spacing={3}>
          <h1 className={styles.title}>Deedclub</h1>

          {isMobile ? (
            <>
              {/* แสดง PIN 6 จุด */}
              <Stack direction="row" spacing={1}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`${styles["pin-dot"]} ${
                      pin.length > i ? styles["filled"] : ""
                    }`}
                  />
                ))}
              </Stack>

              {/* Keypad */}
              <div className={styles.keypad}>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "←", "0"].map(
                  (key) => (
                    <button
                      key={key}
                      className={styles.key}
                      onClick={() => {
                        if (key === "←") handleBackspace();
                        else handleDigitClick(key);
                      }}
                    >
                      {key}
                    </button>
                  )
                )}
              </div>
            </>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ margin: "10px 0px" }}>
                <TextField
                  label="username"
                  {...register("username")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                      },
                    },
                  }}
                />
                {errors.username && (
                  <p className={styles.errorMessage}>
                    {errors.username.message}
                  </p>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ margin: "10px 0px" }}>
                <TextField
                  label="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className={styles.errorMessage}>
                    {errors.password.message}
                  </p>
                )}
              </FormControl>

              <Stack
                className={styles.cardFooter}
                direction={"row"}
                spacing={2}
              >
                <Button
                  onClick={() => reset()}
                  color="error"
                  variant="contained"
                  fullWidth
                >
                  รีเซ็ต
                </Button>
                <Button type="submit" variant="contained" fullWidth>
                  เข้าสู่ระบบ
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Card>
    </div>
  );
}

export default LoginPage;
