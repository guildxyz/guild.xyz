import { forwardRef } from "@chakra-ui/react"
import {
  chakraComponents,
  CreatableSelect,
  GroupBase,
  MultiValueGenericProps,
  Props,
} from "chakra-react-select"
import StyledSelect from "components/common/StyledSelect"
import { PropsWithChildren } from "react"

type PropsHelper = MultiValueGenericProps<unknown, boolean, GroupBase<unknown>>

const customComponents = {
  MultiValueContainer: ({ children, ...props }: PropsWithChildren<PropsHelper>) => (
    <chakraComponents.MultiValueContainer {...props}>
      {props.data.img}
      {children}
    </chakraComponents.MultiValueContainer>
  ),
}

const AdminSelect = forwardRef((props: Props, ref) => (
  <StyledSelect
    as={CreatableSelect}
    components={customComponents}
    ref={ref}
    {...props}
  />
))

export default AdminSelect
