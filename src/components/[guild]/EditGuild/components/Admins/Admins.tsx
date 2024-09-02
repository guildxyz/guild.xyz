import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tag,
  useColorMode,
} from "@chakra-ui/react"
import { HStack, Icon, forwardRef } from "@chakra-ui/react"
import { Warning } from "@phosphor-icons/react"
import {
  CreatableSelect,
  GroupBase,
  MultiValueGenericProps,
  Props,
  chakraComponents,
} from "chakra-react-select"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import StyledSelect from "components/common/StyledSelect"
import CustomMenuList from "components/common/StyledSelect/components/CustomMenuList"
import { useMemo } from "react"
import { PropsWithChildren, useEffect } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { FUEL_ADDRESS_REGEX, SelectOption } from "types"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import shortenHex from "utils/shortenHex"
import { useEnsAddress } from "wagmi"
import { mainnet } from "wagmi/chains"
import TransferOwnership from "../TransferOwnership/TransferOwnership"

export const isValidAddress = (address: string) =>
  ADDRESS_REGEX.test(address) || FUEL_ADDRESS_REGEX.test(address)

const validateAdmins = (admins: string[]) =>
  (typeof admins?.[0] === "string"
    ? admins.every((admin) => isValidAddress(admin.trim()))
    : admins.every((addr: any) => isValidAddress(addr?.address.trim()))) ||
  "Every admin should be a valid address"

const Admins = () => {
  const { isSuperAdmin } = useUser()
  const { formState } = useFormContext()
  const { admins: guildAdmins } = useGuild()
  const { isOwner } = useGuildPermission()
  const ownerAddress = useMemo(
    () => guildAdmins?.find((admin) => admin.isOwner)?.address,
    [guildAdmins]
  )

  const {
    field: { onChange, ref, value: admins, onBlur },
  } = useController({
    name: "admins",
    rules: { validate: validateAdmins },
  })

  const adminOptions = useMemo(() => {
    if (!admins) return []

    const ownerOption = {
      value: ownerAddress,
      label: isValidAddress(ownerAddress) ? shortenHex(ownerAddress) : ownerAddress,
      img: <GuildAvatar address={ownerAddress} size={4} mr="2" />,
      isFixed: true,
    }

    const restAdminOptions = admins
      .filter((admin) => admin.address !== ownerAddress)
      .map((admin) => ({
        value: admin.address,
        label: isValidAddress(ownerAddress)
          ? shortenHex(admin.address)
          : admin.address,
        img: <GuildAvatar address={admin.address} size={4} mr="2" />,
      }))

    return [ownerOption].concat(restAdminOptions)
  }, [admins, ownerAddress])

  const isLoading = !guildAdmins || !adminOptions

  return (
    <>
      <FormControl w="full" isInvalid={!!formState.errors.admins}>
        <Flex justifyContent={"space-between"} w="full">
          <FormLabel>
            Admins{" "}
            {!isOwner && !isSuperAdmin && (
              <Tag>only editable by the Guild owner</Tag>
            )}
          </FormLabel>
          {isOwner || isSuperAdmin ? <TransferOwnership /> : null}
        </Flex>

        <AdminSelect
          placeholder={!isLoading && "Paste address"}
          name="admins"
          ref={(el) => {
            ref(el)
            if (!el?.inputRef) return
            setTimeout(() => {
              el.inputRef?.addEventListener("paste", (event) => {
                const pastedData = event.clipboardData
                  .getData("text")
                  ?.trim()
                  ?.toLowerCase()

                if (!isValidAddress(pastedData)) return
                event.preventDefault()
                if (admins.some(({ address }) => address === pastedData)) return
                onChange([...admins, { address: pastedData }])
                el.inputRef.focus()
              })
            }, 100)
          }}
          value={adminOptions}
          options={adminOptions}
          isMulti
          onBlur={onBlur}
          onChange={(selectedOption: SelectOption[]) => {
            onChange(
              selectedOption?.map((option) => ({
                address: option.value.toLowerCase(),
              }))
            )
          }}
          isLoading={isLoading}
          isClearable={false}
          isDisabled={!isOwner && !isSuperAdmin}
          chakraStyles={{ valueContainer: (base) => ({ ...base, py: 2 }) }}
        />

        <FormErrorMessage>
          {formState.errors.admins?.message as string}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

const CustomMultiValueContainer = (props) => {
  const { colorMode } = useColorMode()

  return (
    <chakraComponents.MultiValueContainer
      {...props}
      sx={{
        ...props.sx,
        bgColor: colorMode === "dark" && props.data.isFixed ? "gray.500" : undefined,
      }}
    />
  )
}

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

const AdminSelect = forwardRef((props: Props, ref) => (
  <StyledSelect
    as={CreatableSelect}
    size="lg"
    components={{
      MultiValueContainer: CustomMultiValueContainer,
      MultiValueLabel: CustomMultiValueLabel,
      Input: (inputProps) => (
        <chakraComponents.Input {...inputProps} placeholder="Paste address" />
      ),
      DropdownIndicator: () => null,
      MenuList: (props) => <CustomMenuList {...props} noResultText="No members" />,
    }}
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

export default Admins
