import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md bg-background border rounded-xl shadow-sm p-8">
        {children}
      </div>
    </div>
  )
}
