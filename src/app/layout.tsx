import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { SignInDialog } from "@/components/SignInDialog";
import { Toaster } from "@/components/ui/Toaster";
import { dystopian, inter } from "@/lib/fonts";
import { cn } from "lib/cssUtils";

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
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
