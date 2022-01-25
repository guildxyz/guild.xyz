import { GroupBase, Props, Select, SelectInstance } from "chakra-react-select"
import { forwardRef, Ref } from "react"
import CustomMenuList from "./components/CustomMenuList"
import CustomSelectOption from "./components/CustomSelectOption"

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
        }),
        inputContainer: (provided) => ({
          ...provided,
          maxWidth: 0,
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
        MenuList: CustomMenuList,
      }}
      menuPortalTarget={document?.getElementById("chakra-react-select-portal")}
    />
  )
)

export default StyledSelect
