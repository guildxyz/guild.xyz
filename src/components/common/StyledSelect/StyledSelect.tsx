import {
  CreatableProps,
  CreatableSelect,
  GroupBase,
  Props,
  Select,
  SelectInstance,
  components,
} from "chakra-react-select"
import { Ref, forwardRef } from "react"
import { OneOf } from "types"
import CustomClearIndicator from "./components/CustomClearIndicator"
import CustomIndicatorsContainerWithCopy from "./components/CustomIndicatorsContainerWithCopy"
import CustomMenuList from "./components/CustomMenuList"
import CustomSelectOption from "./components/CustomSelectOption"

export type StyledSelectProps = OneOf<
  { isCreatable: true; noResultText?: string } & CreatableProps<any, any, any>,
  { noResultText?: string } & Props
> & { as?: any; isCopyable?: boolean }

const StyledSelect = forwardRef(
  (
    { isCreatable, noResultText, isCopyable, ...props }: StyledSelectProps,
    ref: Ref<SelectInstance<unknown, boolean, GroupBase<unknown>>>
  ): JSX.Element => {
    const SelectComponent = props.as ?? (isCreatable ? CreatableSelect : Select)

    return (
      <SelectComponent
        ref={ref}
        {...props}
        chakraStyles={{
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
          ...props.chakraStyles,
        }}
        components={{
          Option: CustomSelectOption,
          MenuList: (menuListProps) =>
            CustomMenuList({ ...menuListProps, noResultText }),
          ClearIndicator: CustomClearIndicator,
          IndicatorsContainer: isCopyable
            ? (containerProps) =>
                CustomIndicatorsContainerWithCopy({
                  ...containerProps,
                  value: props.value,
                })
            : components.IndicatorsContainer,
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
