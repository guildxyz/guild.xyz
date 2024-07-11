import { Header } from "@/components/Header"
import { PageContainer } from "@/components/PageContainer"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { PropsWithChildren } from "react"

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

const Root = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen flex-col">{children}</div>
)

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

const Hero = ({ children }: PropsWithChildren) => (
  <div className="relative">
    <Header />
    {children}
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * Headline
 * -----------------------------------------------------------------------------------------------*/

interface HeadlineProps {
  title: ReactNode
}

const Headline = ({ title }: HeadlineProps) => (
  <PageContainer>
    <h1 className="pt-9 pb-14 font-bold font-display text-4xl text-white tracking-tight sm:text-5xl">
      {title}
    </h1>
  </PageContainer>
)

/* -------------------------------------------------------------------------------------------------
 * Banner
 * -----------------------------------------------------------------------------------------------*/

interface BannerProps extends PropsWithChildren {
  offset?: number
}

const Banner = ({ children, offset = 112 }: BannerProps) => (
  <div
    className={cn(
      "-z-10 absolute inset-0 overflow-hidden",
      `-bottom-[${Math.abs(offset)}px]`
    )}
  >
    <div className="absolute inset-0 bg-[hsl(240_4%_16%)] data-[theme='dark']:bg-[hsl(240_3%_22%)]" />
    {children}
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * Main
 * -----------------------------------------------------------------------------------------------*/

const Main = ({ children }: PropsWithChildren) => (
  <main>
    <PageContainer>{children}</PageContainer>
  </main>
)

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

const Footer = ({ children }: PropsWithChildren) => (
  <footer className="mt-auto">
    <PageContainer>{children}</PageContainer>
  </footer>
)

/* -----------------------------------------------------------------------------------------------*/

export { Root, Hero, Headline, Banner, Main, Footer }
