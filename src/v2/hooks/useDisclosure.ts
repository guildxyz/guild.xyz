import { useBoolean } from "usehooks-ts"

export function useDisclosure() {
  const { value, setTrue, setFalse, toggle } = useBoolean()

  return {
    isOpen: value,
    onOpen: setTrue,
    onClose: setFalse,
    onToggle: toggle,
  }
}

export type DisclosureState = ReturnType<typeof useDisclosure>
