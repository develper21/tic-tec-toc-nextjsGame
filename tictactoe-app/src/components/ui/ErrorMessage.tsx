import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message?: string
  title?: string
}

export function ErrorMessage({ message = 'Something went wrong', title = 'Error' }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="glass rounded-3xl p-8 border-2 border-red-500/30 max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-2">{title}</h2>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  )
}
