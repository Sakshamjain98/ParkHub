'use client'
import { useFormLogin } from '@ParkHub/forms/src/login'
import { Form } from '../atoms/Form'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlInput } from '../atoms/HtmlInput'
import { Button } from '../atoms/Button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface ILoginFormProps {
  className?: string
}
export const LoginForm = ({ className }: ILoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormLogin()

  const { replace } = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <Form
      className="gap-4"
      onSubmit={handleSubmit(async (data) => {
        const { email, password } = data
        setLoading(true)

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        setLoading(false)

        if (result?.ok) {
          replace('/')
        }
        if (result?.error) {
          alert('Login failed. Try again.')
        }
      })}
    >
      <HtmlLabel className="text-white" title="Email" error={errors.email?.message}>
        <HtmlInput
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-primary"
          {...register('email')}
          placeholder="Enter your email"
        />
      </HtmlLabel>
      <HtmlLabel className="text-white" title="Password" error={errors.password?.message}>
        <HtmlInput
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-primary"
          type="password"
          {...register('password')}
          placeholder="Enter your password"
        />
      </HtmlLabel>
      <Button type="submit" fullWidth size="lg" loading={loading}>
        Login
      </Button>
      <div className="mt-1 text-sm text-white/80">
        Don&apos;t have a ParkHub account?
        <br />
        <Link
          href="/register"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Create one
        </Link>{' '}
        now.
      </div>
    </Form>
  )
}
