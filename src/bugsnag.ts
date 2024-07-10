import Bugsnag from "@bugsnag/js"
import { env } from "env"

export const bugsnagStart = () => {
  if (
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "production" ||
    window.location.host !== "guild.xyz"
  )
    return

  Bugsnag.start({
    apiKey: env.NEXT_PUBLIC_BUGSNAG_KEY,
    plugins: [],
    endpoints: {
      notify: "/api/bugsnag/notify",
      sessions: "/api/bugsnag/sessions",
    },
  })
}
