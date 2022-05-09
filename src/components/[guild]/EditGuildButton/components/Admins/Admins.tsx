import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useBreakpointValue,
  usePrevious,
} from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildMembers from "hooks/useGuildMembers"
import { useMemo } from "react"
import { useController, useFormContext } from "react-hook-form"
import useSWR from "swr"
import { SelectOption } from "types"
import shortenHex from "utils/shortenHex"
import AdminSelect from "./components/AdminSelect"

const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i

const validateAdmins = (admins: string[]) =>
  admins.every((admin) => ADDRESS_REGEX.test(admin.trim())) ||
  "Every admin should be a valid address"

const fetchMemberOptions = (
  _: string,
  members: string[],
  library: Web3Provider,
  addressShorten: number
) =>
  Promise.all(
    members.map(async (member) => ({
      label:
        (await library
          .lookupAddress(member)
          .catch(() =>
            addressShorten > 0 ? shortenHex(member, addressShorten) : member
          )) || (addressShorten > 0 ? shortenHex(member, addressShorten) : member),
      value: member,
      img: <GuildAvatar address={member} size={4} mr="2" />,
    }))
  ).catch(() => [])

const Admins = () => {
  const { formState } = useFormContext()
  const { admins: guildAdmins } = useGuild()
  const ownerAddress = useMemo(
    () => guildAdmins?.find((admin) => admin.isOwner)?.address,
    [guildAdmins]
  )
  const addressShorten = useBreakpointValue({ base: 6, sm: 15, md: -1 })
  const { library } = useWeb3React()
  const members = useGuildMembers()

  const {
    field: { onChange, ref, value: admins, onBlur },
  } = useController({ name: "admins", rules: { validate: validateAdmins } })

  const { data: options } = useSWR(
    !!members && !!admins && !!ownerAddress
      ? ["options", members, library, addressShorten]
      : null,
    fetchMemberOptions
  )

  const memberOptions = useMemo(
    () => options?.filter((option) => !admins?.includes(option.value)),
    [options, admins]
  )

  const adminOptions = useMemo(() => {
    if (!options) return undefined

    return admins?.map((admin) => {
      const option = options.find((o) => o.value === admin)

      return {
        ...(option ?? {
          value: admin,
          label: admin,
        }),
        isFixed: admin === ownerAddress,
      }
    })
  }, [options, admins, ownerAddress])

  const prevMemberOptions = usePrevious(memberOptions)

  const isLoading = !guildAdmins || !options || !adminOptions || !memberOptions

  return (
    <>
      <FormControl w="full" isInvalid={!!formState.errors.admins}>
        <FormLabel>Admins</FormLabel>
        <AdminSelect
          placeholder={
            isLoading ? "Loading admins" : "Add address or search members"
          }
          name="admins"
          ref={ref}
          value={adminOptions}
          isMulti
          options={memberOptions ?? prevMemberOptions}
          onBlur={onBlur}
          onChange={(selectedOption: SelectOption[]) => {
            onChange(selectedOption?.map((option) => option.value))
          }}
          isLoading={isLoading}
        />

        <FormErrorMessage>{formState.errors.admins?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}

export default Admins
