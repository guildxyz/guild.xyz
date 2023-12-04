import { atom } from "jotai"
import { MutableRefObject } from "react"
import ReCAPTCHA from "react-google-recaptcha"

export const getRecaptchaToken = async (
  recaptchaRef: MutableRefObject<ReCAPTCHA>,
  isVerified = false
) => {
  const token =
    !recaptchaRef.current || isVerified
      ? undefined
      : await recaptchaRef.current.executeAsync()

  if (token) {
    recaptchaRef.current.reset()
  }

  return token
}

export const recaptchaAtom = atom(null as ReCAPTCHA)
