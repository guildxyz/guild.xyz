import { datadogRum } from "@datadog/browser-rum"
import { RumComponentContextProvider } from "@datadog/rum-react-integration"
import { PropsWithChildren, useEffect } from "react"

const Datadog = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const url = typeof window !== "undefined" ? window.location.host : ""

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || url !== "guild.xyz") return
    datadogRum.init({
      applicationId: "996b7a2a-d610-4235-a5b4-65391973ea76",
      clientToken: "pub7cf22f3b79a010363cf58c859cfa8ad8",
      site: "datadoghq.eu",
      service: "guild.xyz",
      env: "prod",
      silentMultipleInit: true,
      sampleRate: 10,
      trackInteractions: true,
      version: "1.0.0",
      proxyUrl: "/api/ddrum",
      beforeSend(event, _) {
        if (
          // We can ignore these 2 event types, since we can't really get useful information from them
          event.type === "resource" ||
          event.type === "long_task" ||
          // Don't send 3rd party handled errors (e.g. "MetaMask: received invalid isUnlocked parameter")
          (event.type === "error" &&
            ((event.error.source !== "custom" &&
              event.error.handling === "handled") ||
              // Ignoring this event, because it comes from a Chakra UI dependency
              event.error.type === "IgnoredEventCancel" ||
              event.error.message === "Script error." ||
              // Ignore browser extension errors
              event.error.stack.includes("chrome-extension")))
        )
          return false
      },
    })

    datadogRum.startSessionReplayRecording()
  }, [])

  return <RumComponentContextProvider componentName="App" {...{ children }} />
}

export default Datadog
