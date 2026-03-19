import { RegisterForm } from '@ParkHub/ui/src/components/templates/RegisterForm'
import { AuthLayout } from '@ParkHub/ui/src/components/molecules/AuthLayout'

export default function Page() {
  return (
    <AuthLayout title={'Register'}>
      <RegisterForm role="admin" />
    </AuthLayout>
  )
}
