import { createContext, PropsWithChildren, useContext } from "react"

const IntercomContext = createContext<{
  intercomSettings: Record<string, string | number>
  defineIntercomSettingsValue: (key: string, value: string | number) => void
}>({ intercomSettings: undefined, defineIntercomSettingsValue: () => {} })

const IntercomProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const intercomSettings = {}

  const defineIntercomSettingsValue = (key: string, value: string | number) => {
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
