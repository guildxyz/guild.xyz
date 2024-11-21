"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import useIsStuck from "@/hooks/useIsStuck";
import useScrollspy from "@/hooks/useScrollSpy";
import { cn } from "@/lib/cssUtils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { type PropsWithChildren, useEffect } from "react";
import { activeSectionAtom, isNavStuckAtom, isSearchStuckAtom } from "../atoms";
import { ACTIVE_SECTION } from "../constants";

export const smoothScrollTo = (id: string) => {
  const target = document.getElementById(id);

  if (!target) return;

  window.scrollTo({
    behavior: "smooth",
    top: target.offsetTop,
  });
};

const Nav = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom);
  const isSearchStuck = useAtomValue(isSearchStuckAtom);
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);
  const spyActiveSection = useScrollspy(Object.values(ACTIVE_SECTION), 100);
  useEffect(() => {
    if (!spyActiveSection) return;
    setActiveSection(
      spyActiveSection as (typeof ACTIVE_SECTION)[keyof typeof ACTIVE_SECTION],
    );
  }, [spyActiveSection, setActiveSection]);

  return (
    <ToggleGroup
      type="single"
      className="gap-2"
      size={isSearchStuck ? "sm" : "lg"}
      variant={isNavStuck ? "secondary" : "mono"}
      onValueChange={(value) =>
        value &&
        setActiveSection(
          value as (typeof ACTIVE_SECTION)[keyof typeof ACTIVE_SECTION],
        )
      }
      value={activeSection}
    >
      <ToggleGroupItem
        value={ACTIVE_SECTION.yourGuilds}
        className={cn("rounded-xl transition-all", {
          "rounded-lg": isSearchStuck,
        })}
        onClick={() => smoothScrollTo(ACTIVE_SECTION.yourGuilds)}
      >
        Your guilds
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ACTIVE_SECTION.exploreGuilds}
        className={cn("rounded-xl transition-all", {
          "rounded-lg": isSearchStuck,
        })}
        onClick={() => smoothScrollTo(ACTIVE_SECTION.exploreGuilds)}
      >
        Explore guilds
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export const StickyBar = ({ children }: PropsWithChildren) => {
  const setIsNavStuck = useSetAtom(isNavStuckAtom);
  const isSearchStuck = useAtomValue(isSearchStuckAtom);
  const { ref: navToggleRef } = useIsStuck(setIsNavStuck);

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-16 w-full items-center transition-all",
        {
          "h-12": isSearchStuck,
        },
      )}
      ref={navToggleRef}
    >
      <div className="relative flex w-full items-center justify-between">
        <Nav />
        {children}
      </div>
    </div>
  );
};
