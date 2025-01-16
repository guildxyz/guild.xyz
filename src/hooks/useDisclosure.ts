import { useCallback, useState } from "react";

export function useDisclosure(config?: {
  defaultIsOpen?: boolean;
}) {
  const [isOpen, setValue] = useState(config?.defaultIsOpen ?? false);

  const onOpen = useCallback(() => setValue(true), []);
  const onClose = useCallback(() => setValue(false), []);
  const onToggle = useCallback(() => setValue((prev) => !prev), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    setValue,
  };
}

export type DisclosureState = ReturnType<typeof useDisclosure>;
