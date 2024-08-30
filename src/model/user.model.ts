import { z } from "zod";

export const UserSchema = z.object({
  username: z
    .string({ message: "username ต้องเป็นข้อความเท่านั้น" })
    .min(5, { message: "username ต้องมีความยาวมากกว่า 5 ตัวอักษร" })
    .max(100, { message: "username ต้องมีความยาวน้อยกว่า 100 ตัวอักษร" }),
  password: z
    .string()
    .length(6, { message: "password ต้องมีความยาว 6 ตัวอักษร" }),
});

export type User = z.infer<typeof UserSchema>;
