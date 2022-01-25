import { GroupBase, Props, Select, SelectInstance } from "chakra-react-select"
import { forwardRef, Ref } from "react"
import CustomSelectOption from "./ChakraReactSelect/CustomSelectOption"

const StyledSelect = forwardRef(
  (
    props: Props,
    ref: Ref<SelectInstance<unknown, boolean, GroupBase<unknown>>>
  ): JSX.Element => (
    <Select
      ref={ref}
      {...props}
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          width: "full",
        }),
        control: (provided) => ({
          ...provided,
          width: "full",
          // borderLeftRadius: address ? 0 : undefined, // TODO do it programatically
        }),
        menu: (provided) => ({
          ...provided,
          overflow: "visible",
        }),
        placeholder: (provided) => ({
          ...provided,
          maxWidth: "calc(100% - 2rem)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }),
      }}
      components={{
        ...props.components,
        Option: CustomSelectOption,
      }}
    />
  )
)

export default StyledSelect
