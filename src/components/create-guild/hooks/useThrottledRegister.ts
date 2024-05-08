import { useRef } from "react"
import type { ChangeHandler, FieldValues, UseFormRegister } from "react-hook-form"

export function useThrottledRegister(
  register: UseFormRegister<FieldValues>,
  delayMs: number
) {
  const timeoutId = useRef<number | undefined>()

  function throttledRegister(
    ...registerArgs: Parameters<UseFormRegister<FieldValues>>
  ): ReturnType<UseFormRegister<FieldValues>> {
    const registerHandlers = register(...registerArgs)
    const defaultOnChange = registerHandlers.onChange

    registerHandlers.onChange = async (
      ...handlerArgs: Parameters<ChangeHandler>
    ) => {
      const startTimeout = () => {
        timeoutId.current = window.setTimeout(() => {
          defaultOnChange(...handlerArgs)
        }, delayMs)
      }

      clearTimeout(timeoutId.current)
      startTimeout()
    }

    return registerHandlers
  }

  return { throttledRegister }
}
