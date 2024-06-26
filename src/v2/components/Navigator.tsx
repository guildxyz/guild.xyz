"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu"
import {
  Book,
  CircleWavyCheck,
  Code,
  DiscordLogo,
  House,
  Info,
  Package,
  Palette,
  Plus,
  Shield,
  UsersThree,
  File,
} from "@phosphor-icons/react"
import XLogo from "static/icons/x.svg"
import GuildCastle from "components/explorer/AnimatedLogo"
import { buttonVariants } from "@/components/ui/Button"
import { ThemeToggle } from "./ThemeToggle"
import Link from "next/link"

export function Navigator() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="space-x-2 bg-transparent">
            <GuildCastle />
            <span className="font-display text-base font-bold">Guild</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex flex-col rounded-lg text-foreground">
            <div className="flex gap-12 px-3 py-4">
              <ul className="flex flex-col gap-1">
                <li className="my-1 px-4 text-sm font-bold text-card-foreground">
                  Navigation
                </li>
                <ListItem href="/explorer">
                  <House />
                  <span>Explore guilds</span>
                </ListItem>
                <ListItem href="/create-guild">
                  <Plus />
                  <span>Create guild</span>
                </ListItem>
                <ListItem href="/leaderboard">
                  <CircleWavyCheck />
                  <span>Guild Pins leaderboard</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://help.guild.xyz"
                  rel="noopener"
                >
                  <Info />
                  <span>Guide</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://help.guild.xyz/en/collections/9537762-case-studies"
                  rel="noopener"
                >
                  <Book />
                  <span>Case studies</span>
                </ListItem>
                <ListItem href="/privacy-policy">
                  <Shield />
                  <span>Privacy Policy</span>
                </ListItem>
                <ListItem href="/terms-of-use">
                  <File />
                  <span>Terms of Use</span>
                </ListItem>
              </ul>
              <ul className="flex w-36 flex-col items-stretch gap-1">
                <li className="my-1 px-4 text-sm font-bold text-card-foreground">
                  Other
                </li>
                <ListItem
                  target="_blank"
                  href="https://discord.gg/KUkghUdk2G"
                  rel="noopener"
                >
                  <DiscordLogo />
                  <span>Discord</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://twitter.com/guildxyz"
                  rel="noopener"
                >
                  <XLogo />
                  <span>Twitter</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://github.com/guildxyz/guild.xyz"
                  rel="noopener"
                >
                  <Code />
                  <span>Code</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://github.com/guildxyz/guild-sdk"
                  rel="noopener"
                >
                  <Package />
                  <span>Guild SDK</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://guildxyz.notion.site/Join-the-Guild-Team-7ffd822c4d7749cb9c1adb525c858ae1"
                  rel="noopener"
                >
                  <UsersThree />
                  <span>Team</span>
                </ListItem>
                <ListItem
                  target="_blank"
                  href="https://guild.xyz/guild-xyz-brand-kit.zip"
                  rel="noopener"
                >
                  <Palette />
                  <span>Brand kit</span>
                </ListItem>
              </ul>
            </div>
            <div className="flex items-center justify-between bg-background px-7 py-4 text-foreground">
              <span>Theme:</span>
              <ThemeToggle />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, children, ...props }, ref) => (
  <li>
    <Link passHref legacyBehavior ref={ref} {...props}>
      <NavigationMenuLink
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex items-center justify-start gap-2 whitespace-nowrap",
          className
        )}
      >
        {children}
      </NavigationMenuLink>
    </Link>
  </li>
))
