import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useServerData from "hooks/useServerData"
import { Info, ShieldCheck } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import Category from "./components/Category"

const ChannelsToGate = () => {
  const { roles } = useGuild()
  const { guildPlatform, index, platformRoleData } = useRolePlatform()
  const {
    data: { categories },
  } = useServerData(guildPlatform.platformGuildId)

  const roleId = useWatch({
    name: `rolePlatforms.${index}.platformRoleId`,
  })

  const hasGuardedRole = roles.some(
    (role) =>
      role.rolePlatforms?.find(
        (platform) => platform.guildPlatformId === guildPlatform.id
      )?.platformRoleData?.isGuarded
  )

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  const gatedChannels = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.gatedChannels`,
  })

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      `rolePlatforms.${index}.platformRoleData.gatedChannels`,
      Object.fromEntries(
        categories.map(({ channels, id, name }) => [
          id,
          {
            name,
            channels: Object.fromEntries(
              (channels ?? []).map((channel) => [
                channel.id,
                {
                  name: channel.name,
                  isChecked: touchedFields.rolePlatforms?.[index]?.platformRoleData
                    ?.gatedChannels?.[id]?.channels?.[channel.id]
                    ? gatedChannels?.[id]?.channels?.[channel.id]?.isChecked
                    : channel.roles.includes(roleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, roleId])

  return (
    <FormControl>
      {/* dummy htmlFor, so clicking it doesn't toggle the first checkbox */}
      <Wrap as="div" mb="2" spacing="3">
        <HStack>
          <FormLabel htmlFor="-" m="0">
            <Text as="span">Channels to gate</Text>
          </FormLabel>
          <Tooltip
            label="Choose the channels / categories you want only members with this role to see"
            shouldWrapChildren
          >
            <Info />
          </Tooltip>
        </HStack>
        {
          /* {(!hasGuardedRole || platformRoleData?.isGuarded) && (
          <HStack ml={{ base: "auto !important", sm: "unset !important" }}>
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
              {`- or `}
            </Text>
            <Guard />
          </HStack>
        )} */
          platformRoleData?.isGuarded && (
            <Tag colorScheme={"blue"}>
              <TagLeftIcon as={ShieldCheck} />
              <TagLabel>whole server guarded</TagLabel>
            </Tag>
          )
        }
      </Wrap>
      {(categories ?? []).length <= 0 ? (
        <Button isDisabled isLoading loadingText="Loading channels" w="full" />
      ) : (
        <Box maxH="sm" overflowY={"auto"} px={2}>
          {Object.keys(gatedChannels ?? {}).map((categoryId) => (
            <Category
              key={categoryId}
              rolePlatformIndex={index}
              categoryId={categoryId}
              isGuarded={platformRoleData?.isGuarded}
            />
          ))}
        </Box>
      )}
    </FormControl>
  )
}

export default ChannelsToGate
