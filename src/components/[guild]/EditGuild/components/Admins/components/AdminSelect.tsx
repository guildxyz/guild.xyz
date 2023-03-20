import { forwardRef } from "@chakra-ui/react"
import {
  chakraComponents,
  CreatableSelect,
  GroupBase,
  MultiValueGenericProps,
  Props,
} from "chakra-react-select"
import StyledSelect from "components/common/StyledSelect"
import CustomMenuList from "components/common/StyledSelect/components/CustomMenuList"
import { PropsWithChildren } from "react"

type PropsHelper = MultiValueGenericProps<unknown, boolean, GroupBase<unknown>>

const customComponents = {
  MultiValueContainer: ({
    children,
    ...multiValueContainerProps
  }: PropsWithChildren<PropsHelper>) => (
    <chakraComponents.MultiValueContainer {...multiValueContainerProps}>
      {multiValueContainerProps.data.img}
      {children}
    </chakraComponents.MultiValueContainer>
  ),
  Input: (inputProps) => (
    <chakraComponents.Input
      {...inputProps}
      pl={1}
      placeholder="Paste address or search members"
    />
  ),
  MenuList: (props) => <CustomMenuList {...props} noResultText="No members" />,
}

const AdminSelect = forwardRef((props: Props, ref) => (
  <StyledSelect
    as={CreatableSelect}
    components={customComponents}
    ref={ref}
    {...props}
    chakraStyles={{
      input: (provided) => ({
        ...provided,
        minWidth: "31ch",
      }),
    }}
  />
))

export default AdminSelect
