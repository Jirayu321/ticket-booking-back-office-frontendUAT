import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, FormControl, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User, UserSchema } from "../../model/user.model";
import styles from "./login-page.module.css";

function LoginPage() {
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

  function onSubmit(data: User) {
    try {
      console.log(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            className="w-full h-full"
            alignItems={"center"}
            justifyContent={"center"}
            spacing={3}
          >
            <h1 className={styles.title}>Deedclub</h1>
            <FormControl fullWidth>
              <TextField label="username" {...register("username")} />
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
