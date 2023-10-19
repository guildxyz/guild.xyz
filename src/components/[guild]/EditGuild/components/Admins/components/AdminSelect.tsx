import { forwardRef, Icon } from "@chakra-ui/react"
import {
  chakraComponents,
  CreatableSelect,
  GroupBase,
  MultiValueGenericProps,
  Props,
} from "chakra-react-select"
import StyledSelect from "components/common/StyledSelect"
import CustomMenuList from "components/common/StyledSelect/components/CustomMenuList"
import { Bug } from "phosphor-react"
import { PropsWithChildren, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { mainnet, useEnsAddress } from "wagmi"

const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i

type PropsHelper = MultiValueGenericProps<unknown, boolean, GroupBase<unknown>>
const CustomMultiValueContainer = ({
  children,
  ...multiValueContainerProps
}: PropsWithChildren<PropsHelper>) => {
  const domain = ADDRESS_REGEX.test(multiValueContainerProps.data.value)
    ? undefined
    : multiValueContainerProps.data.value
  const { data: resolvedAddress } = useEnsAddress({
    name: domain,
    chainId: mainnet.id,
  })

  const { setError, setValue, control, trigger } = useFormContext()
  const admins = useWatch({ control: control, name: "admins" })

  useEffect(() => {
    if (
      domain &&
      resolvedAddress &&
      !admins.includes(resolvedAddress.toLowerCase())
    ) {
      setValue(
        "admins",
        admins.map((admin) =>
          admin.address === domain ? { address: resolvedAddress } : admin
        )
      )

      trigger("admins")
    }

    if (resolvedAddress === null) {
      setError("admins", {
        message: "Reverse resolving failed",
      })
    }
  }, [resolvedAddress, domain])

  return (
    <chakraComponents.MultiValueContainer
      {...{
        ...multiValueContainerProps,
        data: { value: resolvedAddress },
      }}
      sx={{ ...multiValueContainerProps.sx, minH: "7", fontSize: "sm" }}
    >
      {resolvedAddress === null ||
      admins.includes(resolvedAddress?.toLowerCase()) ? (
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
    size="lg"
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
