"use client"

import { preload } from "react-dom"

export function PreloadResources() {
  preload("/banner.png", { as: "image" })
  return null
}
