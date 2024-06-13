import { atom } from "jotai"
import ReCAPTCHA from "react-google-recaptcha"

export const recaptchaAtom = atom({
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  ref: null as ReCAPTCHA,
})
export const shouldUseReCAPTCHAAtom = atom(false)
