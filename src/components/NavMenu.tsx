"use client";

import { cn } from "@/lib/cssUtils";
import {
  Book,
  Code,
  Desktop,
  DiscordLogo,
  File,
  House,
  Info,
  List,
  Moon,
  Package,
  Palette,
  Plus,
  Shield,
  Sun,
  UsersThree,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import { useIsClient } from "foxact/use-is-client";
import { useTheme } from "next-themes";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import GuildLogo from "static/logo.svg";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";

export const NavMenu = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" className="rounded-2xl">
        <GuildLogo className="size-4" />
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
);

const NavGroup = ({
  title,
  children,
}: { title: string; children: ReactNode }) => (
  <div className="flex min-w-36 max-w-max flex-col gap-[2px]">
    <span className="my-1 pl-4 font-bold text-foreground-secondary text-sm">
      {title}
    </span>
    {children}
  </div>
);

const NavButton = ({
  href,
  children,
}: { href: string; children: ReactNode }) => {
  const pathname = usePathname();

  const isExternal = href.startsWith("http");
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
  };

  const Wrapper = isExternal ? "a" : Link;

  return (
    <Wrapper {...wrapperProps}>
      <Button
        variant={pathname === href ? "solid" : "ghost"}
        className={cn(
          "h-10 w-full justify-start gap-2",
          pathname === href ? "font-semibold" : "font-normal",
        )}
      >
        {children}
      </Button>
    </Wrapper>
  );
};

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return;
  }

  return (
    <ToggleGroup
      size="icon"
      type="single"
      value={theme}
      onValueChange={(selected) => setTheme(selected)}
      aria-label="Toggle between themes"
      variant="primary"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Toggle light mode"
        className="size-8"
      >
        <Sun weight="bold" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark mode"
        className="size-8"
      >
        <Moon weight="bold" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="system"
        aria-label="Toggle system default"
        className="size-8"
      >
        <Desktop weight="bold" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
