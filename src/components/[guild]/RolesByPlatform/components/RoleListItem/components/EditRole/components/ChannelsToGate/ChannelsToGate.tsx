import {
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import Guard from "components/[guild]/EditGuild/components/Guard"
import useGuild from "components/[guild]/hooks/useGuild"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { CaretDown, Info, LockSimple } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import Category, { GatedChannels } from "./components/Category"

type Props = {
  isGuardOn?: boolean
}

const ChannelsToGate = ({ isGuardOn }: Props) => {
  const { guildPlatforms } = useGuild()
  const { authorization, onOpen: onAuthOpen, isAuthenticating } = useDCAuth("guilds")
  const {
    data: { categories },
    // This index hardcoding is solved in rolePlatforms PR
  } = useServerData(guildPlatforms?.[0]?.platformGuildId, {
    authorization,
  })

  const roleId = useWatch({ name: "rolePlatforms.0.platformRoleId" })
  const isGuarded = useWatch({ name: "rolePlatforms.0.platformRoleData.isGuarded" })

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  const gatedChannels = useWatch<{ gatedChannels: GatedChannels }>({
    name: "gatedChannels",
    defaultValue: {},
  })

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      "gatedChannels",
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
                  isChecked: touchedFields.gatedChannels?.[id]?.channels?.[
                    channel.id
                  ]
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

  const numOfGatedChannels = useMemo(
    () =>
      Object.values(gatedChannels)
        .flatMap(
          ({ channels }) =>
            Object.values(channels).map(({ isChecked }) => +isChecked) ?? []
        )
        .reduce((acc, curr) => acc + curr, 0),
    [gatedChannels]
  )

  const bg = useColorModeValue("white", "blackAlpha.300")
  const border = useColorModeValue(
    "1px solid var(--chakra-colors-gray-200)",
    "1px solid var(--chakra-colors-whiteAlpha-300)"
  )
  const btnProps: ButtonProps = {
    w: "full",
    h: 12,
    justifyContent: "space-between",
  }

  return (
    <FormControl maxW="sm">
      {/* dummy htmlFor, so clicking it doesn't toggle the first checkbox in the popover */}
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
        <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
          {`- or `}
        </Text>
        <Guard isOn={isGuardOn} />
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
        <Popover matchWidth>
          <PopoverTrigger>
            <Button
              rightIcon={<CaretDown />}
              bg={bg}
              border={border}
              {...btnProps}
              isDisabled={isGuarded}
            >
              {isGuarded
                ? "Whole server gated"
                : `${numOfGatedChannels} channels gated`}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            w="auto"
            borderRadius={"lg"}
            shadow="xl"
            maxH="sm"
            overflowY="auto"
          >
            <PopoverBody>
              {Object.keys(gatedChannels).map((categoryId) => (
                <Category key={categoryId} categoryId={categoryId} />
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </FormControl>
  )
}

export default ChannelsToGate
