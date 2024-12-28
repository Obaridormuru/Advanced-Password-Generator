import { PasswordGenerator } from '@/components/password-generator'
import { Toaster } from 'sonner'

export default function Page() {
  return (
    <div className="container">
      <Toaster position="top-center" />
      <PasswordGenerator />
    </div>
  )
}

