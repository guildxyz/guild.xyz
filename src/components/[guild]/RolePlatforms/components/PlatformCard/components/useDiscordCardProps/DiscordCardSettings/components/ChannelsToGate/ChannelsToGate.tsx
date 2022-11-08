import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Tag,
  Text,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useServerData from "hooks/useServerData"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import Category from "./components/Category"

const ChannelsToGate = () => {
  const { guildPlatform, index, platformRoleData } = useRolePlatform()
  const {
    data: { categories },
  } = useServerData(guildPlatform.platformGuildId)

  const roleId = useWatch({
    name: `rolePlatforms.${index}.platformRoleId`,
  })

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
          <Tag>Temporarily disabled</Tag>
        </HStack>
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
            />
          ))}
        </Box>
      )}
    </FormControl>
  )
}

export default ChannelsToGate
