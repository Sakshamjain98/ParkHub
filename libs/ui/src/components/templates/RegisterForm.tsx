'use client'
import { Role } from '@ParkHub/util/types'
import { useFormRegister } from '@ParkHub/forms/src/register'
import { useMutation } from '@apollo/client'
import { RegisterWithCredentialsDocument } from '@ParkHub/network/src/gql/generated'
import { Form } from '../atoms/Form'
import { signIn } from 'next-auth/react'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlInput } from '../atoms/HtmlInput'
import { Button } from '../atoms/Button'
import Link from 'next/link'

export interface ISignupFormProps {
  className?: string
  role?: Role
}
export const RegisterForm = ({ className, role }: ISignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormRegister()

  const [registerWithCredentials, { loading }] = useMutation(
    RegisterWithCredentialsDocument,
  )

  return (
    <Form
      className="gap-4"
      onSubmit={handleSubmit(async (formData) => {
        const { data, errors } = await registerWithCredentials({
          variables: {
            registerWithCredentialsInput: formData,
          },
        })

        if (errors) {
          alert(errors)
        }

        if (data) {
          alert(`User ${data.registerWithCredentials.name || formData.email} created. 🎉`)
          signIn('credentials', {
            email: formData.email,
            password: formData.password,
            callbackUrl: '/',
          })
        }
      })}
    >
      <HtmlLabel className="text-white" title="Email" error={errors.email?.message}>
        <HtmlInput
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-primary"
          placeholder="Enter your email"
          {...register('email')}
        />
      </HtmlLabel>
      <HtmlLabel className="text-white" title="Password" error={errors.password?.message}>
        <HtmlInput
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-primary"
          type="password"
          placeholder="Create a password"
          {...register('password')}
        />
      </HtmlLabel>
      <HtmlLabel className="text-white" title="Display name" error={errors.name?.message}>
        <HtmlInput
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-primary"
          placeholder="Enter your display name"
          {...register('name')}
        />
      </HtmlLabel>
      {Object.keys(errors).length ? (
        <div className="text-xs text-red-300">
          Please fix the above {Object.keys(errors).length} errors
        </div>
      ) : null}
      <Button type="submit" fullWidth size="lg" loading={loading}>
        Register
      </Button>
      <div className="mt-1 text-sm text-white/80">
        Already have a ParkHub account?
        <br />
        <Link
          href="/login"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Login
        </Link>{' '}
        now.
      </div>
    </Form>
  )
}
