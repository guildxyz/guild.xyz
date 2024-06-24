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
} from "phosphor-react"
import XLogo from "@/public/static/icons/x.svg"
import { GuildCastle } from "@/components/GuildCastle"
import { buttonVariants } from "@/components/ui/Button"

export function Navigator() {
  return (
    <div className="flex gap-12 p-6 border">
      <ul className="flex flex-col gap-1">
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
        <ListItem target="_blank" href="https://help.guild.xyz" rel="noopener">
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
      <ul className="flex flex-col gap-1">
        <ListItem
          target="_blank"
          href="https://discord.gg/KUkghUdk2G"
          rel="noopener"
        >
          <DiscordLogo />
          <span>Discord</span>
        </ListItem>
        <ListItem target="_blank" href="https://twitter.com/guildxyz" rel="noopener">
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
  )
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="space-x-2">
            <GuildCastle />
            <span className="font-display font-bold text-base">Guild</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex gap-12 p-6">
            <ul className="flex flex-col gap-4">
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
              <ListItem target="_blank" href="https://help.guild.xyz" rel="noopener">
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
            <ul className="flex flex-col gap-4">
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
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({ children, ...rest }: React.ComponentProps<"a">) {
  return (
    <li>
      <a
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex gap-2 items-center whitespace-nowrap justify-start"
        )}
        {...rest}
      >
        {children}
      </a>
    </li>
  )
}

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className,
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
//
// ListItem.displayName = "ListItem";
