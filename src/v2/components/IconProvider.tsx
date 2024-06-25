"use client"

import { IconContext } from "@phosphor-icons/react"
import { PropsWithChildren } from "react"

export function IconProvider({ children }: PropsWithChildren) {
  return (
    <IconContext.Provider
      value={{
        color: "currentColor",
        size: "1.2em",
        weight: "bold",
        mirrored: false,
      }}
    >
      {children}
    </IconContext.Provider>
  )
}
