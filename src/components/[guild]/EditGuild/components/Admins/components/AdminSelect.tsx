import { forwardRef, Icon, Spinner } from "@chakra-ui/react"
import {
  chakraComponents,
  CreatableSelect,
  GroupBase,
  MultiValueGenericProps,
  Props,
} from "chakra-react-select"
import StyledSelect from "components/common/StyledSelect"
import CustomMenuList from "components/common/StyledSelect/components/CustomMenuList"
import useReverseResolve from "hooks/resolving/useReverseResolve"
import { Bug } from "phosphor-react"
import { PropsWithChildren, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type PropsHelper = MultiValueGenericProps<unknown, boolean, GroupBase<unknown>>
const CustomMultiValueContainer = ({
  children,
  ...multiValueContainerProps
}: PropsWithChildren<PropsHelper>) => {
  const domain = multiValueContainerProps.data.value.startsWith("0x")
    ? undefined
    : multiValueContainerProps.data.value

  const address = useReverseResolve(domain)
  const { setError, setValue, control, trigger } = useFormContext()
  const admins = useWatch({ control: control, name: "admins" })

  useEffect(() => {
    if (domain && address?.resolvedAddress) {
      setValue(
        "admins",
        admins.map((admin) => (admin === domain ? address?.resolvedAddress : admin))
      )
      trigger("admins")
    }

    if (address.error) {
      setError("admins", {
        message: "Reverse resolving failed",
      })
    }
  }, [address, domain])

  return (
    <chakraComponents.MultiValueContainer
      {...{ ...multiValueContainerProps, data: { value: address?.resolvedAddress } }}
    >
      {domain && !address ? (
        <Spinner size="xs" mr={2} />
      ) : address.error === true ? (
        <Icon as={Bug} mr={1} color="red.300" boxSize={4} weight="bold" />
      ) : (
        multiValueContainerProps.data.img
      )}
      {children}
    </chakraComponents.MultiValueContainer>
  )
}

const customComponents = {
  MultiValueContainer: CustomMultiValueContainer,
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
  />
))

export default AdminSelect
