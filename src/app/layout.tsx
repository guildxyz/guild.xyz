import type { Metadata } from "next";
import "./globals.css";
import { CsrProviders } from "components/csr-providers";
import { dystopian, inter } from "fonts";
import { cn } from "lib/css-utils";

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
      <body
        className={cn(
          dystopian.variable,
          inter.variable,
          "bg-background text-foreground antialiased",
        )}
      >
        <CsrProviders>{children}</CsrProviders>
      </body>
    </html>
  );
};

export default RootLayout;
