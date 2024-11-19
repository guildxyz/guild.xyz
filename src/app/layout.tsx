import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "components/Providers";
import { dystopian, inter } from "fonts";
import { cn } from "lib/cssUtils";
import { Header } from "./components/Header";
import { SignInDialog } from "./components/SignInDialog";

export const metadata: Metadata = {
  title: "Guildhall",
  applicationName: "Guildhall",
  description:
    "Automated membership management for the platforms your community already uses.",
  // icons: {
  //   icon: "/guild-icon.png",
  // },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(dystopian.variable, inter.variable)}>
        <Providers>
          <Header />
          {children}

          {/* TODO: maybe load this dynamically? */}
          <SignInDialog />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
