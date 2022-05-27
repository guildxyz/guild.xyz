import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  usePrevious,
} from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildMembers from "hooks/useGuildMembers"
import { LockSimple } from "phosphor-react"
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

const fetchMemberOptions = (_: string, members: string[], library: Web3Provider) =>
  Promise.all(
    members.map(async (member) => ({
      label:
        (await library.lookupAddress(member).catch(() => shortenHex(member))) ||
        shortenHex(member),
      value: member,
      img: <GuildAvatar address={member} size={4} mr="2" />,
    }))
  ).catch(() => [])

const Admins = () => {
  const { formState } = useFormContext()
  const {
    admins: guildAdmins,
    fetchAsOwner,
    fetchedAsOwner,
    showMembers,
    isSigning,
    isLoading: isGuildLoading,
  } = useGuild()
  const ownerAddress = useMemo(
    () => guildAdmins?.find((admin) => admin.isOwner)?.address,
    [guildAdmins]
  )
  const { library } = useWeb3React()
  const members = useGuildMembers()

  const {
    field: { onChange, ref, value: admins, onBlur },
  } = useController({ name: "admins", rules: { validate: validateAdmins } })

  const { data: options } = useSWR(
    !!members && !!admins && !!ownerAddress ? ["options", members, library] : null,
    fetchMemberOptions
  )

  const memberOptions = useMemo(
    () => options?.filter((option) => !admins?.includes(option.value)),
    [options, admins]
  )

  const adminOptions = useMemo(() => {
    if (!options) return undefined

    const ownerOption = {
      ...(options.find((o) => o.value === ownerAddress) ?? {
        value: ownerAddress,
        label: shortenHex(ownerAddress),
        img: <GuildAvatar address={ownerAddress} size={4} mr="2" />,
      }),
      isFixed: true,
    }

    return [ownerOption].concat(
      admins
        ?.filter((admin: string) => admin !== ownerAddress)
        ?.map((admin: string) => {
          const option = options.find((o) => o.value === admin)

          return {
            ...(option ?? {
              value: admin,
              label: shortenHex(admin),
              img: <GuildAvatar address={admin} size={4} mr="2" />,
            }),
          }
        })
    )
  }, [options, admins, ownerAddress])

  const prevMemberOptions = usePrevious(memberOptions)

  const isLoading = !guildAdmins || !options || !adminOptions || !memberOptions

  const loadingText = useMemo(
    () =>
      (isSigning && "Check your wallet") ||
      (isGuildLoading && "Loading admins") ||
      "Loading",
    [isSigning, isGuildLoading]
  )

  return (
    <>
      <FormControl w="full" isInvalid={!!formState.errors.admins}>
        <FormLabel>Admins</FormLabel>

        {!showMembers && !fetchedAsOwner ? (
          <Button
            onClick={fetchAsOwner}
            isLoading={isSigning || isGuildLoading}
            loadingText={loadingText}
            spinnerPlacement="end"
            rightIcon={<LockSimple />}
            variant="outline"
            w="full"
            justifyContent={"space-between"}
          >
            Sign to view admins
          </Button>
        ) : (
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

                  if (ADDRESS_REGEX.test(pastedData)) {
                    event.preventDefault()
                    onChange([...admins, pastedData])
                    el.inputRef.focus()
                  }
                })
              }, 100)
            }}
            value={adminOptions}
            isMulti
            options={memberOptions ?? prevMemberOptions}
            onBlur={onBlur}
            onChange={(selectedOption: SelectOption[]) => {
              onChange(selectedOption?.map((option) => option.value.toLowerCase()))
            }}
            isLoading={isLoading}
          />
        )}

        <FormErrorMessage>{formState.errors.admins?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}

export default Admins
