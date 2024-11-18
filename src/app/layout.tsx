import type { Metadata } from "next";
import "./globals.css";
import { dystopian, inter } from "fonts";
import { cn } from "lib/cn";

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
    <html lang="en" data-theme="dark">
      <body
        className={cn(
          dystopian.variable,
          inter.variable,
          "bg-background text-foreground antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
