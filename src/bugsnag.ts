import Bugsnag from "@bugsnag/js"

export const bugsnagStart = () => {
  if (
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "production" ||
    window.location.host !== "guild.xyz"
  )
    return

  Bugsnag.start({
    apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY,
    plugins: [],
    endpoints: {
      notify: "/api/bugsnag/notify",
      sessions: "/api/bugsnag/sessions",
    },
  })
}
