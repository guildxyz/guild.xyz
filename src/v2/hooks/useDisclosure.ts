import { useBoolean } from "usehooks-ts"

export function useDisclosure(config?: {
  defaultIsOpen?: boolean
}) {
  const { value, setTrue, setFalse, toggle, setValue } = useBoolean(
    config?.defaultIsOpen
  )

  return {
    isOpen: value,
    onOpen: setTrue,
    onClose: setFalse,
    onToggle: toggle,
    setValue,
  }
}

export type DisclosureState = ReturnType<typeof useDisclosure>
