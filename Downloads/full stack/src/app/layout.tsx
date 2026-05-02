import './globals.css'

export const metadata = {
  title: 'Triluxo Technologies',
  description: 'Innovative technology solutions for the future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
