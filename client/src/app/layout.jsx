import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessProvider from "./Provider";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Whatsapp",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <StoreProvider>
               <ToastContainer
                 position="top-right"
                 autoClose={2000}
                 hideProgressBar={false}
                 newestOnTop={false}
                 closeOnClick={false}
                 rtl={false}
                 pauseOnFocusLoss
                 draggable
                 pauseOnHover
                 theme="colored"
                 />
        {children}
        </StoreProvider>
      </body>
    </html>
  );
}
