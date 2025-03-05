import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SwanSorter - Intelligent Data Sorting Solutions",
  description: "SwanSorter provides elegant, efficient data sorting solutions for businesses of all sizes.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark tech-pattern`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}