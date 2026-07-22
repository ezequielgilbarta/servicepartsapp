'use client'

export default function FormError({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2"
    >
      {message}
    </div>
  )
}
