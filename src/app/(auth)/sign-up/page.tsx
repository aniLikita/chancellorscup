'use client'

import React from 'react';
import AuthForm from "@/components/AuthForm";
import {signUpSchema} from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { z } from "zod";

const SignUpPage = () => {

    const router = useRouter()

    const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
        const { email, password } = data

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    fullName: data.fullName,
                    universityId: data.universityId,
                }
            }
        })

        if (error) {
            return { success: false, error: error.message }
        }

        router.push('/') // or dashboard
        return { success: true }
    }

    return (
    <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
            email: "",
            password: "",
            fullName: "",
            universityId: "",
        }}
        onSubmit={handleSubmit}
    />
  );
};

export default SignUpPage;
