import { forwardRef, HStack, Icon } from "@chakra-ui/react"
import {
  chakraComponents,
  CreatableSelect,
  GroupBase,
  MultiValueGenericProps,
  Props,
} from "chakra-react-select"
import CopyableAddress from "components/common/CopyableAddress"
import StyledSelect from "components/common/StyledSelect"
import CustomMenuList from "components/common/StyledSelect/components/CustomMenuList"
import { Warning } from "phosphor-react"
import { PropsWithChildren, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useEnsAddress } from "wagmi"
import { mainnet } from "wagmi/chains"
import { isValidAddress } from "../Admins"

type PropsHelper = MultiValueGenericProps<unknown, boolean, GroupBase<unknown>>
const CustomMultiValueLabel = (props: PropsWithChildren<PropsHelper>) => {
  const domain = isValidAddress(props.data.value) ? undefined : props.data.value
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
        message: "Resolving address failed",
      })
    }
  }, [domain, resolvedAddress, admins, setValue, trigger, setError])

  return (
    <chakraComponents.MultiValueLabel {...props}>
      <HStack gap="0">
        {resolvedAddress === null ||
        admins.includes(resolvedAddress?.toLowerCase()) ? (
          <Icon as={Warning} mr={1} color="red.300" boxSize={4} weight="bold" />
        ) : (
          props.data.img
        )}
        <CopyableAddress
          address={props.data.value}
          domain={domain ?? resolvedAddress}
          size="sm"
        />
      </HStack>
    </chakraComponents.MultiValueLabel>
  )
}

const customComponents = {
  MultiValueLabel: CustomMultiValueLabel,
  Input: (inputProps) => (
    <chakraComponents.Input {...inputProps} placeholder="Paste address" />
  ),
  DropdownIndicator: () => null,
  MenuList: (props) => <CustomMenuList {...props} noResultText="No members" />,
}

const AdminSelect = forwardRef((props: Props, ref) => (
  <StyledSelect
    as={CreatableSelect}
    size="lg"
    components={customComponents}
    openMenuOnClick={false}
    ref={ref}
    {...props}
    chakraStyles={{
      valueContainer: (base) => ({ ...base, py: 2, px: 3 }),
      multiValue: (base) => ({ ...base, minH: "7" }),
      input: (provided) => ({
        ...provided,
        pl: 1,
        minWidth: "14ch",
      }),
    }}
  />
))

export default AdminSelect
