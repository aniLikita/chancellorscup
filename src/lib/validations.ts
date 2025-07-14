import {z} from "zod";

export const signUpSchema = z.object({
    fullname: z.string().min(3),
    email: z.string().email(),
    universityId: z.string().min(10),
    password: z.string().min(8),
})

export const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8,{ message: 'Password must be at least 8 characters' }),
})