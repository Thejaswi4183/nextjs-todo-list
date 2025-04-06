// src/app/layout.js
import "../styles/globals.css"; // Global CSS for layout

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Todo App</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
