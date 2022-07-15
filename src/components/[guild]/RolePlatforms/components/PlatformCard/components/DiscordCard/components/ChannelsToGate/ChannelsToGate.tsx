import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Guard from "components/[guild]/EditGuild/components/Guard"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { Info, LockSimple } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import Category from "./components/Category"

const ChannelsToGate = () => {
  const { guildPlatforms, roles } = useGuild()
  const { rolePlatformData } = useRolePlatform()
  const { authorization, onOpen: onAuthOpen, isAuthenticating } = useDCAuth("guilds")
  const {
    data: { categories },
  } = useServerData(
    guildPlatforms?.find((p) => p.platformId === PlatformType.DISCORD)
      ?.platformGuildId,
    {
      authorization,
    }
  )

  const rolePlatforms = useWatch({ name: "rolePlatforms" })
  const discordGuildPlatformId = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )?.id
  const discordRolePlatformIndex = rolePlatforms
    .map((p) => p.guildPlatformId)
    .indexOf(discordGuildPlatformId)

  const roleId = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleId`,
  })
  const isGuarded = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.isGuarded`,
  })

  const hasGuardedRole = roles
    .map((r) => r.rolePlatforms)
    ?.flat()
    ?.some((rolePlatform) => rolePlatform.platformRoleData?.isGuarded)

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  const gatedChannels = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels`,
  })

  const btnProps: ButtonProps = {
    w: "full",
    h: 12,
    justifyContent: "space-between",
  }

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels`,
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
                  isChecked: touchedFields.rolePlatforms?.[discordRolePlatformIndex]
                    ?.platformRoleData?.gatedChannels?.[id]?.channels?.[channel.id]
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
      <HStack mb="2">
        <FormLabel htmlFor="-" m="0">
          <Text as="span">Channels to gate</Text>
        </FormLabel>
        <Tooltip
          label="Choose the channels / categories you want only members with this role to see"
          shouldWrapChildren
        >
          <Info />
        </Tooltip>
        {(!hasGuardedRole || rolePlatformData?.isGuarded) && (
          <>
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
              {`- or `}
            </Text>
            <Guard />
          </>
        )}
      </HStack>
      {!authorization?.length ? (
        <Button
          onClick={onAuthOpen}
          isLoading={isAuthenticating}
          loadingText="Check the popup window"
          spinnerPlacement="end"
          rightIcon={<LockSimple />}
          variant="outline"
          {...btnProps}
        >
          Authenticate to view channels
        </Button>
      ) : (categories ?? []).length <= 0 ? (
        <Button isDisabled isLoading loadingText="Loading channels" w="full" />
      ) : (
        <Box maxH="sm" overflowY={"auto"} px={2}>
          {Object.keys(gatedChannels ?? {}).map((categoryId) => (
            <Category
              key={categoryId}
              categoryId={categoryId}
              isGuarded={isGuarded}
            />
          ))}
        </Box>
      )}
    </FormControl>
  )
}

export default ChannelsToGate
