import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tag,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import GuildAvatar from "components/common/GuildAvatar"
import { useMemo } from "react"
import { useController, useFormContext } from "react-hook-form"
import { FUEL_ADDRESS_REGEX, SelectOption } from "types"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import shortenHex from "utils/shortenHex"
import TransferOwnership from "../TransferOwnership"
import AdminSelect from "./components/AdminSelect"

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

export default Admins
