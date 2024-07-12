"use client"

import { env } from "env"
import { useAtomValue } from "jotai"
import dynamic from "next/dynamic"
import { shouldUseReCAPTCHAAtom } from "utils/recaptcha"

const DynamicReCAPTCHA = dynamic(() => import("components/common/ReCAPTCHA"))
export const Recaptcha = () => {
  const shouldUseReCAPTCHA = useAtomValue(shouldUseReCAPTCHAAtom)
  if (!shouldUseReCAPTCHA) return

  return (
    <DynamicReCAPTCHA
      sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      size="invisible"
    />
  )
}
