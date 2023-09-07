import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tag,
  usePrevious,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import useUniqueMembers from "hooks/useUniqueMembers"
import { useMemo } from "react"
import { useController, useFormContext } from "react-hook-form"
import useSWR from "swr"
import { SelectOption } from "types"
import shortenHex from "utils/shortenHex"
import TransferOwnership from "../TransferOwnership"
import AdminSelect from "./components/AdminSelect"

const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i

const validateAdmins = (admins: string[]) =>
  (typeof admins?.[0] === "string"
    ? admins.every((admin) => ADDRESS_REGEX.test(admin.trim()))
    : admins.every((addr: any) => ADDRESS_REGEX.test(addr?.address.trim()))) ||
  "Every admin should be a valid address"

const fetchMemberOptions = ([_, members, provider]) =>
  Promise.all(
    members.map(async (member) => ({
      label:
        (await provider.lookupAddress(member).catch(() => shortenHex(member))) ||
        shortenHex(member),
      value: member,
      img: <GuildAvatar address={member} size={4} mr="2" />,
    }))
  ).catch(() => [])

const Admins = () => {
  const { isSuperAdmin } = useUser()
  const { formState } = useFormContext()
  const { roles, admins: guildAdmins } = useGuild()
  const { isOwner } = useGuildPermission()
  const ownerAddress = useMemo(
    () => guildAdmins?.find((admin) => admin.isOwner)?.address,
    [guildAdmins]
  )
  const { provider } = useWeb3React()
  const members = useUniqueMembers(roles)

  const {
    field: { onChange, ref, value: admins, onBlur },
  } = useController({
    name: "admins",
    rules: { validate: validateAdmins },
  })

  const { data: options } = useSWR(
    !!members && !!admins && !!ownerAddress ? ["options", members, provider] : null,
    fetchMemberOptions
  )

  const memberOptions = useMemo(
    () =>
      options?.filter(
        (option) => !admins?.some(({ address }) => address === option.value)
      ),
    [options, admins]
  )

  const adminOptions = useMemo(() => {
    if (!options) return undefined

    const ownerOption = {
      ...(options.find((o) => o.value === ownerAddress) ?? {
        value: ownerAddress,
        label: ADDRESS_REGEX.test(ownerAddress)
          ? shortenHex(ownerAddress)
          : ownerAddress,
        img: <GuildAvatar address={ownerAddress} size={4} mr="2" />,
      }),
      isFixed: true,
    }

    const toConcat = admins
      ?.filter((admin) => admin.address !== ownerAddress)
      ?.map((admin) => {
        const option = options.find((o) => o.value === admin.address)

        return {
          ...(option ?? {
            value: admin.address,
            label: ADDRESS_REGEX.test(ownerAddress)
              ? shortenHex(admin.address)
              : admin.address,
            img: <GuildAvatar address={admin.address} size={4} mr="2" />,
          }),
        }
      })

    return [ownerOption].concat(toConcat ?? [])
  }, [options, admins, ownerAddress])

  const prevMemberOptions = usePrevious(memberOptions)

  const isLoading = !guildAdmins || !options || !adminOptions || !memberOptions

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
          {isOwner ? <TransferOwnership /> : null}
        </Flex>

        <AdminSelect
          placeholder={!isLoading && "Add address or search members"}
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

                if (!ADDRESS_REGEX.test(pastedData)) return
                event.preventDefault()
                if (admins.some(({ address }) => address === pastedData)) return
                onChange([...admins, { address: pastedData }])
                el.inputRef.focus()
              })
            }, 100)
          }}
          value={adminOptions}
          isMulti
          options={memberOptions ?? prevMemberOptions}
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
