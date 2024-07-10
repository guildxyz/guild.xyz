"use client"

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
  Shield,
  UsersThree,
  XLogo,
} from "@phosphor-icons/react/dist/ssr"
import dynamic from "next/dynamic"
import Link, { LinkProps } from "next/link"
import { AnchorHTMLAttributes, ReactNode } from "react"
import { ThemeToggle } from "../ThemeToggle"
import { Button } from "../ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"

const AnimatedLogo = dynamic(() => import("components/explorer/AnimatedLogo"), {
  ssr: false,
  loading: () => <img src="/guildLogos/logo.svg" className="size-4" />,
})

export const NavMenu = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button className="gap-2 rounded-2xl text-white" variant="ghost">
        <AnimatedLogo />
        <span className="font-display text-base font-bold">Guild</span>
        <List weight="bold" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      className="mt-1 w-auto origin-top-left overflow-hidden p-0"
    >
      <nav className="flex flex-col gap-2 px-3 py-4 sm:flex-row sm:gap-12">
        <NavGroup title="Navigation">
          <NavButton href="/explorer">
            <House weight="bold" />
            Explore guilds
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

          <NavButton href="https://guildxyz.notion.site/Join-the-Guild-Team-7ffd822c4d7749cb9c1adb525c858ae1">
            <UsersThree weight="bold" />
            Team
          </NavButton>

          <NavButton href="https://guild.xyz/guild-xyz-brand-kit.zip">
            <Palette weight="bold" />
            Brand kit
          </NavButton>
        </NavGroup>
      </nav>

      <div className="flex items-center justify-between bg-card-secondary px-7 py-4 text-foreground">
        <span>Theme:</span>
        <ThemeToggle />
      </div>
    </PopoverContent>
  </Popover>
)

const NavGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex min-w-36 max-w-max flex-col gap-[2px]">
    <span className="my-1 pl-4 text-sm font-bold text-muted-foreground">
      {title}
    </span>
    {children}
  </div>
)

const NavButton = ({ href, children }: { href: string; children: ReactNode }) => {
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
        variant="ghost"
        className="h-10 w-full justify-start gap-2 font-normal"
      >
        {children}
      </Button>
    </Wrapper>
  )
}