import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { CaretDown, Info } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import Category, { GatedChannels } from "./components/Category"

type Props = {
  roleId?: string
}

const ChannelsToGate = ({ roleId }: Props) => {
  const { platforms } = useGuild()
  const { authorization, onOpen: onAuthOpen, isAuthenticating } = useDCAuth("guilds")
  const {
    data: { categories },
  } = useServerData(platforms?.[0]?.platformId, {
    authorization,
  })

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

  return (
    <FormControl maxW="sm">
      {/* dummy htmlFor, so clicking it doesn't toggle the first checkbox in the popover */}
      <FormLabel htmlFor="-">
        <HStack>
          <Text as="span">Channels to gate</Text>
          <Tooltip
            label="Choose the channels / categories you want only members with this role to see"
            shouldWrapChildren
          >
            <Info />
          </Tooltip>
        </HStack>
      </FormLabel>
      {!authorization?.length ? (
        <Button
          colorScheme="DISCORD"
          onClick={onAuthOpen}
          isLoading={isAuthenticating}
          loadingText="Check the popup window"
        >
          Authenticate
        </Button>
      ) : (categories ?? []).length <= 0 ? (
        <Button
          colorScheme="DISCORD"
          isDisabled
          isLoading
          loadingText="Loading channels"
        />
      ) : (
        <Popover matchWidth>
          <PopoverTrigger>
            <Button
              rightIcon={<CaretDown />}
              h="12"
              justifyContent={"space-between"}
              w="full"
            >
              {numOfGatedChannels} channels gated
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
