"use client"

import { cn } from "@/lib/utils"
import {
  Book,
  CircleWavyCheck,
  Code,
  DiscordLogo,
  File,
  House,
  Info,
  List,
  Package,
  Palette,
  Plus,
  Shield,
  UsersThree,
  XLogo,
} from "@phosphor-icons/react/dist/ssr"
import dynamic from "next/dynamic"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { AnchorHTMLAttributes, ReactNode } from "react"
import GuildLogo from "static/logo.svg"
import { ThemeToggle } from "../ThemeToggle"
import { Button } from "../ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"

const AnimatedLogo = dynamic(() => import("components/explorer/AnimatedLogo"), {
  ssr: false,
  loading: () => <GuildLogo className="size-4 text-banner-foreground" />,
})

export const NavMenu = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button className="rounded-2xl text-banner-foreground" variant="ghost">
        <AnimatedLogo />
        <span className="font-bold font-display text-base">Guild</span>
        <List weight="bold" className="ml-1" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      className="mt-1 w-auto min-w-[300px] origin-top-left overflow-hidden p-0"
    >
      <nav className="flex flex-col gap-2 px-3 py-4 sm:flex-row sm:gap-12">
        <NavGroup title="Navigation">
          <NavButton href="/explorer">
            <House weight="bold" />
            Explore guilds
          </NavButton>

          <NavButton href="/create-guild">
            <Plus weight="bold" />
            Create guild
          </NavButton>

          <NavButton href="/leaderboard">
            <CircleWavyCheck weight="bold" />
            Guild Pins leaderboard
          </NavButton>

          <NavButton href="https://help.guild.xyz">
            <Info weight="bold" />
            Guide
          </NavButton>

          <NavButton href="https://help.guild.xyz/en/collections/9537762-case-studies">
            <Book weight="bold" />
            Case studies
          </NavButton>

          <NavButton href="/privacy-policy">
            <Shield weight="bold" />
            Privacy Policy
          </NavButton>

          <NavButton href="/terms-of-use">
            <File weight="bold" />
            Terms of Use
          </NavButton>
        </NavGroup>

        <NavGroup title="Other">
          <NavButton href="https://discord.gg/KUkghUdk2G">
            <DiscordLogo weight="bold" />
            Discord
          </NavButton>

          <NavButton href="https://twitter.com/guildxyz">
            <XLogo weight="bold" />
            Twitter
          </NavButton>

          <NavButton href="https://github.com/guildxyz/guild.xyz">
            <Code weight="bold" />
            Code
          </NavButton>

          <NavButton href="https://github.com/guildxyz/guild-sdk">
            <Package weight="bold" />
            Guild SDK
          </NavButton>

          <NavButton href="https://careers.guild.xyz">
            <UsersThree weight="bold" />
            Team
          </NavButton>

          <NavButton href="https://guild.xyz/guild-xyz-brand-kit.zip">
            <Palette weight="bold" />
            Brand kit
          </NavButton>
        </NavGroup>
      </nav>

      <div className="flex items-center justify-between bg-card-secondary px-7 py-4 text-foreground text-sm">
        <span>Theme:</span>
        <ThemeToggle />
      </div>
    </PopoverContent>
  </Popover>
)

const NavGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex min-w-36 max-w-max flex-col gap-[2px]">
    <span className="my-1 pl-4 font-bold text-muted-foreground text-sm">
      {title}
    </span>
    {children}
  </div>
)

const NavButton = ({ href, children }: { href: string; children: ReactNode }) => {
  const pathname = usePathname()

  const isExternal = href.startsWith("http")
  const wrapperProps = {
    href,
    ...(isExternal
      ? ({
          target: "_blank",
          rel: "noopener",
        } satisfies AnchorHTMLAttributes<HTMLAnchorElement>)
      : ({
          passHref: true,
          legacyBehavior: true,
        } satisfies Partial<LinkProps>)),
  }

  const Wrapper = isExternal ? "a" : Link

  return (
    <Wrapper {...wrapperProps}>
      <Button
        variant={pathname === href ? "solid" : "ghost"}
        className={cn(
          "h-10 w-full justify-start gap-2",
          pathname === href ? "font-semibold" : "font-normal"
        )}
      >
        {children}
      </Button>
    </Wrapper>
  )
}
