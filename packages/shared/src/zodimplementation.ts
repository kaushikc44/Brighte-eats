import { z } from "zod";

export const UserSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    name: z.string().min(1, { message: "Name can not be empty" }),
    mobile: z.string().min(1, { message: "Mobile can not be empty" }),
    postcode: z.string().regex(/^\d{4}$/, { message: "Australian postcode must be exactly 4 digits" }),
    service: z.array(z.enum(["delivery", "pick-up", "payment"])).min(1, { message: "At least one service required" }),
});

export type Schema = z.infer<typeof UserSchema>;
