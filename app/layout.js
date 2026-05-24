export const metadata = {
  title: 'Goshen Agrofarm',
  description: 'De notre ferme à votre table.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin:0, padding:0, background:'#F4F6F5' }}>
        {children}
      </body>
    </html>
  )
}
