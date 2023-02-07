import { createContext, PropsWithChildren, useContext } from "react"

const IntercomContext = createContext<{
  intercomSettings: Record<string, string | number>
  defineIntercomSettingsValue: (key: string, value: string | number) => void
  triggerChat: () => void
}>({
  intercomSettings: undefined,
  defineIntercomSettingsValue: () => {},
  triggerChat: () => {},
})

const IntercomProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  let intercomSettings = {}

  const defineIntercomSettingsValue = (key: string, value: string | number) => {
    if (typeof window === "undefined") return
    const windowAsObject = window as Record<string, any>

    if (!windowAsObject.intercomSettings) windowAsObject.intercomSettings = {}

    windowAsObject.intercomSettings = {
      ...windowAsObject.intercomSettings,
      [key]: value,
    }

    intercomSettings = { ...windowAsObject.intercomSettings }

    windowAsObject.Intercom?.("update", windowAsObject.intercomSettings)
  }

  const triggerChat = () => {
    if (typeof window === "undefined") return
    const windowAsObject = window as Record<string, any>

    windowAsObject.Intercom?.("show")
  }

  return (
    <IntercomContext.Provider
      value={{ intercomSettings, defineIntercomSettingsValue, triggerChat }}
    >
      {children}
    </IntercomContext.Provider>
  )
}

const useIntercom = () => useContext(IntercomContext)

export default IntercomProvider
export { useIntercom }
