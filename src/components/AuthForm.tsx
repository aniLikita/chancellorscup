'use client'
import {zodResolver} from "@hookform/resolvers/zod";
import {DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn} from "react-hook-form";
import {ZodType} from "zod";
import {Input} from "@/components/ui/input";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from "@/components/ui/form";


interface Props<T extends FieldValues>{
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{success: boolean, error?: string}>,
  type: 'SIGN_IN' | 'SIGN_UP'
}

const AuthForm =
    <T extends FieldValues> ({type, schema, defaultValues, onSubmit }: Props<T>) =>
{


    const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,

  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (!result.success && result.error) {
      console.error(result.error);
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {type === "SIGN_UP" && (
            <FormField
              control={form.control}
              name= {'fullName' as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name={'email' as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input required type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'password' as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input required type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "SIGN_UP" && (
            <FormField
              control={form.control}
              name={'universityId' as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matriculation No.</FormLabel>
                  <FormControl>
                    <Input required type="text" placeholder="Enter your university ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit">{type === "SIGN_IN" ? "Sign In" : "Sign Up"}</Button>

          <div className="mt-4 text-center">
            <p>
              {type === "SIGN_IN" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <Link 
                href={type === "SIGN_IN" ? "/sign-up" : "/sign-in"} 
                className="text-blue-500 hover:underline"
              >
                {type === "SIGN_IN" ? "Sign Up" : "Sign In"}
              </Link>
            </p>
          </div>
        </form>
      </Form>
  )
};

export default AuthForm;
