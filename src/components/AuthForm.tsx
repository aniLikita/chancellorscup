'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
    UseFormReturn,
} from 'react-hook-form'
import { ZodType } from 'zod'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from '@/components/ui/form'

interface Props<T extends FieldValues> {
    schema: ZodType<T>
    defaultValues: T
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
    type: 'SIGN_IN' | 'SIGN_UP'
}

const AuthForm = <T extends FieldValues>({
                                             type,
                                             schema,
                                             defaultValues,
                                             onSubmit,
                                         }: Props<T>) => {
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data)
        if (!result.success && result.error) {
            console.error(result.error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                {type === 'SIGN_UP' && (
                    <FormField
                        control={form.control}
                        name={'fullName' as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/80">Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="John Doe"
                                        className="bg-gray-900 text-white border border-gray-700"
                                        {...field}
                                    />
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
                            <FormLabel className="text-white/80">Email</FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    type="email"
                                    placeholder="you@email.com"
                                    className="bg-gray-900 text-white border border-gray-700"
                                    {...field}
                                />
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
                            <FormLabel className="text-white/80">Password</FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-gray-900 text-white border border-gray-700"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {type === 'SIGN_UP' && (
                    <FormField
                        control={form.control}
                        name={'universityId' as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/80">Matric Number</FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="U21/SCI/XXXX"
                                        className="bg-gray-900 text-white border border-gray-700"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition"
                >
                    {type === 'SIGN_IN' ? 'Sign In' : 'Sign Up'}
                </Button>

                <div className="text-sm text-center mt-4 text-white/70">
                    {type === 'SIGN_IN' ? (
                        <>
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="text-yellow-300 hover:underline">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already registered?{' '}
                            <Link href="/sign-in" className="text-yellow-300 hover:underline">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </form>
        </Form>
    )
}

export default AuthForm
