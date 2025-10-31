import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    </div>
  )
}
