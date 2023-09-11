import { OptionProps } from "@zag-js/combobox/dist/combobox.types"
import { createContext, HTMLAttributes, PropsWithChildren, useContext } from "react"
import { SelectOption } from "types"

type Props = {
  options: SelectOption[]
  getOptionProps: (props: OptionProps) => HTMLAttributes<HTMLElement>
}

const ComboboxOptionsContext = createContext<Props>(undefined)

const ComboboxOptionsProvider = ({
  children,
  ...context
}: PropsWithChildren<Props>): JSX.Element => (
  <ComboboxOptionsContext.Provider value={context}>
    {children}
  </ComboboxOptionsContext.Provider>
)

const useComboboxOptions = () => useContext(ComboboxOptionsContext)

export { ComboboxOptionsProvider, useComboboxOptions }
