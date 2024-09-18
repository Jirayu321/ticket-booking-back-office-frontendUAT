import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, FormControl, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User, UserSchema } from "../../model/user.model";
import styles from "./login-page.module.css";
import { login } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
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

  async function onSubmit(data: User) {
    try {
      toast.loading("กำลังเข้าสู่ระบบ...");
      const { username, password } = data;
      toast.dismiss();
      const token = await login({ username, password });
      localStorage.setItem("token", token);
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/all-events");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }
  return (
    <div className={styles.container}>
      <Card className={styles.card} >
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            className="w-full h-full"
            alignItems={"center"}
            justifyContent={"center"}
            spacing={3}
          >
            <h1 className={styles.title}>Deedclub</h1>
            <FormControl fullWidth>
              <TextField label="username" {...register("username")}  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none", 
                        transform: "translateY(5px)",
                   
                      },
                    },
                  }} />
              {errors.username && (
                <p className={styles.errorMessage}>{errors.username.message}</p>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </FormControl>
            <Stack className={styles.cardFooter} direction={"row"} spacing={2}>
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
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
