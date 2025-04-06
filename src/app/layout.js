// src/app/layout.js
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todo App with Auth",
  description: "A multi-user todo list with Clerk authentication",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClerkLoading>
            <p className="text-center mt-4">Loading authentication...</p>
          </ClerkLoading>

          <ClerkLoaded>
            {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
