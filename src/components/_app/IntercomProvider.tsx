import { createContext, PropsWithChildren, useContext } from "react"

const IntercomContext = createContext<{
  intercomSettings: Record<string, string>
  defineIntercomSettingsValue: (key: string, value: string) => void
}>(undefined)

const IntercomProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const intercomSettings = {}

  const defineIntercomSettingsValue = (key: string, value: string) => {
    if (typeof window === "undefined") return

    const windowAsObject = window as Record<string, any>

    if (!windowAsObject.intercomSettings) windowAsObject.intercomSettings = {}

    windowAsObject.intercomSettings = {
      ...windowAsObject.intercomSettings,
      [key]: value,
    }
  }

  return (
    <IntercomContext.Provider
      value={{ intercomSettings, defineIntercomSettingsValue }}
    >
      {children}
    </IntercomContext.Provider>
  )
}

const useIntercom = () => useContext(IntercomContext)

export default IntercomProvider
export { useIntercom }
