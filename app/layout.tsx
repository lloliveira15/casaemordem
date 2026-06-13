import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
})

export const metadata: Metadata = {
  title: "Casa em Ordem - Organize as tarefas da sua casa com quem você ama",
  description:
    "Crie, atribua e acompanhe tarefas domésticas em casal. Com templates inteligentes, lembretes por email e relatórios de produtividade.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={plusJakartaSans.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
