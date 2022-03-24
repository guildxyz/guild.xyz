import { FormControl, FormErrorMessage, useBreakpointValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildMembers from "hooks/useGuildMembers"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"
import shortenHex from "utils/shortenHex"
import AdminSelect from "./components/AdminSelect"

const Admins = () => {
  const { register, formState, control } = useFormContext()
  const { admins: guildAdmins } = useGuild()
  const ownerAddress = useMemo(
    () => guildAdmins?.find((admin) => admin.isOwner)?.address,
    [guildAdmins]
  )
  const admins = useWatch({ name: "admins" })
  const addressShorten = useBreakpointValue({ base: 10, sm: 15, md: -1 })
  const { library } = useWeb3React()
  const members = useGuildMembers()
  const [memberOptions, setMemberOptions] = useState(null)

  const createOptions = (array) =>
    Promise.all(
      array.map(async (member) => ({
        label: (await library.lookupAddress(member)) || shortenHex(member),
        value: member,
        img: <GuildAvatar address={member} size={4} mr="2" />,
      }))
    )

  useEffect(() => {
    const getMemberOptions = async () => {
      const filtered = members.filter(
        (address) => !admins.includes(address) && address !== ownerAddress
      )
      if (!filtered.length) return
      const newOptions = await createOptions(filtered)
      setMemberOptions(newOptions)
    }
    getMemberOptions()
  }, [members, admins, ownerAddress])

  return (
    <>
      <FormControl w="full" isInvalid={!!formState.errors.admins}>
        <Controller
          control={control}
          name="admins"
          render={({ field: { onChange, onBlur, ref, value } }) => (
            <AdminSelect
              placeholder="Add address or search members"
              name="admins"
              ref={ref}
              value={createOptions(value)}
              isMulti
              options={memberOptions}
              onBlur={onBlur}
              onChange={(selectedOption: SelectOption[]) =>
                onChange(selectedOption?.map((option) => option.value))
              }
            />
          )}
        />

        <FormErrorMessage>{formState.errors.admins?.message}</FormErrorMessage>
      </FormControl>

      {/* <Center w="full" overflowY="auto">
        <UnorderedList w="min" maxH="300px" m={0}>
          {editedAdmins?.length ? (
            editedAdmins.map((address) => (
              <Box key={address}>
                <Tag
                  size="lg"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="gray"
                  my={2}
                  w="full"
                  justifyContent="space-between"
                >
                  <TagLabel>
                    {addressShorten > 0
                      ? shortenHex(address, addressShorten)
                      : address}
                  </TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      form.setValue(
                        "admins",
                        editedAdmins.filter(
                          (adminAddress) => adminAddress !== address
                        )
                      )
                    }
                  />
                </Tag>
              </Box>
            ))
          ) : (
            <Text colorScheme={"gray"} whiteSpace="nowrap">
              {editedAdmins.length <= 0 ? "No admin addresses" : "No results"}
            </Text>
          )}
        </UnorderedList>
      </Center> */}
    </>
  )
}

export default Admins
