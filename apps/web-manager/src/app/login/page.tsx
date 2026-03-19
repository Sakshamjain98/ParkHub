import { LoginForm } from '@ParkHub/ui/src/components/templates/LoginForm'
import { AuthLayout } from '@ParkHub/ui/src/components/molecules/AuthLayout'

export default function Page() {
  return (
    <AuthLayout title={'Login'}>
      <LoginForm />
    </AuthLayout>
  )
}
