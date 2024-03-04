import { atom } from "jotai"
import ReCAPTCHA from "react-google-recaptcha"

export const recaptchaAtom = atom({
  ref: null as ReCAPTCHA,
})
export const shouldUseReCAPTCHAAtom = atom(false)
