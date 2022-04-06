import { Flex, Img, Stack, Text, usePrevious } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

type Props = {
  serverData: { value: string; label: string; img: string }
  onSelect?: (id: string) => void
  onCancel?: () => void
}

const DCServerCard = ({ serverData, onSelect, onCancel }: Props): JSX.Element => {
  const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverData.value}&permissions=8&scope=bot%20applications.commands`
    )

  const { setValue } = useFormContext()

  const {
    data: { isAdmin, channels },
  } = useServerData(serverData.value, {
    refreshInterval: !!activeAddBotPopup ? 2000 : 0,
    refreshWhenHidden: true,
  })

  const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)

  useEffect(() => {
    if (!!prevActiveAddBotPopup && !activeAddBotPopup && isAdmin) {
      setValue("DISCORD.platformId", serverData.value)
    }
  }, [prevActiveAddBotPopup, activeAddBotPopup, isAdmin])

  useEffect(() => {
    if (channels?.length > 0 && activeAddBotPopup) {
      activeAddBotPopup.close()
    }
  }, [channels, , activeAddBotPopup])

  // Hotfix... we should find a better solution for this!
  const image =
    serverData?.img === "./default_discord_icon.png"
      ? "/default_discord_icon.png"
      : serverData.img

  return (
    <Card position="relative">
      <Img
        position="absolute"
        inset={0}
        w="full"
        src={image}
        alt={serverData.label}
        filter="blur(10px)"
        transform="scale(1.25)"
        opacity={0.5}
      />

      <Stack position="relative" direction="column" spacing={0}>
        <Flex py={8} alignItems="center" justifyContent="center">
          <Img src={image} alt={serverData.label} borderRadius="full" boxSize={28} />
        </Flex>

        <Stack
          maxW="full"
          direction="row"
          px={{ base: 5, sm: 6 }}
          pb={{ base: 5, sm: 6 }}
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
        >
          <Text
            as="span"
            isTruncated
            fontFamily="display"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
          >
            {serverData.label}
          </Text>
          {!isAdmin && (
            <Button
              h={10}
              colorScheme="DISCORD"
              onClick={openAddBotPopup}
              isLoading={!!activeAddBotPopup}
            >
              Setup
            </Button>
          )}
          {isAdmin && onSelect && (
            <Button
              h={10}
              colorScheme="green"
              onClick={() => onSelect(serverData.value)}
            >
              Select
            </Button>
          )}
          {isAdmin && !onSelect && onCancel && (
            <Button h={10} onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  )
}

export default DCServerCard
