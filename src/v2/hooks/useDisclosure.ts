import { useBoolean } from "usehooks-ts"

export function useDisclosure() {
  const { value, setTrue, setFalse, toggle, setValue } = useBoolean()

  return {
    isOpen: value,
    onOpen: setTrue,
    onClose: setFalse,
    onToggle: toggle,
    setValue,
  }
}

export type DisclosureState = ReturnType<typeof useDisclosure>
