'use client'
import React from 'react';
import AuthForm from "@/components/AuthForm";
import {signUpSchema} from "@/lib/validations";

const page = () => {
  return (
    <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
            email: "",
            password: "",
            fullname: "",
            universityId: 0,
        }}
        onSubmit={async () => ({ success: true })}
    />
  );
};

export default page;
