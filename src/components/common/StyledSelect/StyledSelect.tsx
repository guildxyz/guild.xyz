import {
  CreatableProps,
  CreatableSelect,
  GroupBase,
  Props,
  Select,
  SelectInstance,
} from "chakra-react-select"
import { forwardRef, Ref } from "react"
import CustomClearIndicator from "./components/CustomClearIndicator"
import CustomMenuList from "./components/CustomMenuList"
import CustomSelectOption from "./components/CustomSelectOption"

export type StyledSelectProps = (
  | ({ isCreatable: true; noResultText?: string } & CreatableProps<any, any, any>)
  | ({ isCreatable?: never; noResultText?: string } & Props)
) & { as?: any }

const StyledSelect = forwardRef(
  (
    { isCreatable, noResultText, ...props }: StyledSelectProps,
    ref: Ref<SelectInstance<unknown, boolean, GroupBase<unknown>>>
  ): JSX.Element => {
    const SelectComponent = props.as ?? (isCreatable ? CreatableSelect : Select)
    return (
      <SelectComponent
        ref={ref}
        {...props}
        chakraStyles={{
          ...props.chakraStyles,
          container: (provided) => ({
            ...provided,
            width: "full",
            maxWidth: "full",
            ...props.chakraStyles?.container,
          }),
          input: (provided) => ({
            ...provided,
            autoComplete: "none",
          }),
          placeholder: (provided) => ({
            ...provided,
            maxWidth: "calc(100% - 2rem)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            pointerEvents: "none",
            ...props.chakraStyles?.placeholder,
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            pl: 0,
            pr: 2,
            bgColor: "transparent",
          }),
        }}
        components={{
          Option: CustomSelectOption,
          MenuList: (menuListProps) =>
            CustomMenuList({ ...menuListProps, noResultText }),
          ClearIndicator: CustomClearIndicator,
          IndicatorSeparator: null,
          ...props.components,
        }}
        menuPortalTarget={document?.getElementById("chakra-react-select-portal")}
        menuShouldBlockScroll={true}
        menuShouldScrollIntoView={false}
      />
    )
  }
)

export default StyledSelect
