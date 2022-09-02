import AuthRedirect from "components/AuthRedirect"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const GoogleAuth = () => {
  const router = useRouter()
  const [isUnsupported, setIsUnsupported] = useState(false)

  useEffect(() => {
    if (!router.isReady || !window.opener) {
      setIsUnsupported(true)
      return
    }

    const target = window.location.origin

    if (router.query.code?.toString())
      window.opener.postMessage({
        type: "GOOGLE_AUTH_SUCCESS",
        data: {
          code: router.query.code?.toString(),
          state: router.query.state?.toString(),
        },
        target,
      })
  }, [router])

  return <AuthRedirect isUnsupported={isUnsupported} />
}

export default GoogleAuth
