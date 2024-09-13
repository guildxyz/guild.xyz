"use client"

import { cn } from "@/lib/utils"
import Color from "color"
import { useProfile } from "../_hooks/useProfile"

export const ProfileColorBanner = () => {
  const { data: profile } = useProfile()

  if (!profile?.backgroundImageUrl?.startsWith("#")) return null

  const color = Color(profile.backgroundImageUrl)
  const patternOpacity =
    color.lightness() > 90
      ? "opacity-20"
      : color.lightness() > 75
        ? "opacity-15"
        : color.lightness() > 60
          ? "opacity-10"
          : "opacity-5"

  return (
    <>
      <div
        className={cn("absolute inset-0 bg-[url('/banner.svg')]", patternOpacity)}
        style={{
          backgroundSize: "auto 50%",
          backgroundPosition: "top 5px right 0px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 5%, var(--banner))",
          filter: "brightness(50%)",
        }}
      />
    </>
  )
}
