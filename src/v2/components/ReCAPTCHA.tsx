"use client"

import { useSetAtom } from "jotai"
import GoogleReCAPTCHA, { ReCAPTCHAProps } from "react-google-recaptcha"
import { recaptchaAtom } from "utils/recaptcha"

const ReCAPTCHA = (props: ReCAPTCHAProps) => {
  const setRecaptcha = useSetAtom(recaptchaAtom)

  return (
    <GoogleReCAPTCHA
      ref={(recaptcha) => {
        /**
         * Setting only a property of this object, because the `useLoginWithGoogle`
         * hook won't re-run if the atom changes
         */
        setRecaptcha((prev) => {
          prev.ref = recaptcha
          return prev
        })
      }}
      {...props}
    />
  )
}

export default ReCAPTCHA
