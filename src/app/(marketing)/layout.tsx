import { ConfettiProvider } from "@/components/Confetti"
import type { Metadata } from "next"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Create profile",
}

const CreateProfile = ({ children }: PropsWithChildren) => {
  return <ConfettiProvider>{children}</ConfettiProvider>
}

export default CreateProfile
