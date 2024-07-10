const triggerChat = () => {
  if (typeof window === "undefined") return

  if (window.Intercom) {
    window.Intercom?.("show")
    return
  }

  const facade: HTMLButtonElement | null = document.querySelector(
    ".live-chat-loader-placeholder [role='button']"
  )
  facade?.click()
}

const addIntercomSettings = (newData: Window["intercomSettings"]) => {
  if (typeof window === "undefined" || !newData) return

  if (!window.intercomSettings) window.intercomSettings = {}

  const shouldUpdate = Object.entries(newData).some(
    ([key, value]) => window.intercomSettings?.[key] !== value
  )

  if (!shouldUpdate) return

  window.intercomSettings = {
    ...window.intercomSettings,
    ...newData,
  }

  // In case Intercom is loaded, we update the setting
  window.Intercom?.("update", window.intercomSettings)
}

const pushToIntercomSetting = (settingName: string, value: string) => {
  if (typeof window === "undefined") return

  if (!window.intercomSettings) window.intercomSettings = {}

  if (window.intercomSettings[settingName]?.toString().length)
    window.intercomSettings[settingName] += `,${value}`
  else window.intercomSettings[settingName] = value

  // In case Intercom is loaded, we update the setting
  window.Intercom?.("update", window.intercomSettings)
}

declare global {
  interface Window {
    intercomSettings?: Record<string, string | number | boolean>
    Intercom?: (
      action: "show" | "update",
      intercomSettings?: Window["intercomSettings"]
    ) => void
  }
}

export { addIntercomSettings, pushToIntercomSetting, triggerChat }
