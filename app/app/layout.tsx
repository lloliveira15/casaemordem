import { Sidebar } from "@/components/layout/sidebar"
import { AppTheme } from "@/components/layout/app-theme"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-theme flex min-h-screen bg-background text-foreground">
      <AppTheme />
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}
