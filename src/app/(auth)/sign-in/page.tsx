'use client'

import React from 'react';
import AuthForm from "@/components/AuthForm";
import {signInSchema} from "@/lib/validations";
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const SignInPage = () => {
    const router = useRouter();
    const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
        const {email, password} = data
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { success: false, error: error.message }
        }

        router.push('/') // or wherever your dashboard is
        return { success: true }
    }
  return (
      <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{
              email: "",
              password: "",
          }}
          onSubmit={handleSubmit}
      />
  );
};

export default SignInPage;
