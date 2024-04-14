import { usePrevious } from "@chakra-ui/react"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import OptionCard from "components/common/OptionCard"
import usePopupWindow from "hooks/usePopupWindow"
import useServerData from "hooks/useServerData"
import Link from "next/link"
import { ArrowSquareIn } from "phosphor-react"
import usePlatformUsageInfo from "platforms/hooks/usePlatformUsageInfo"
import { useEffect } from "react"

type Props = {
  serverData: {
    id: string
    name: string
    img: string
    owner: boolean
  }
  onSelect?: (id: string) => void
  onCancel?: () => void
}

const DCServerCard = ({ serverData, onSelect, onCancel }: Props): JSX.Element => {
  const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverData.id}&permissions=268782673&scope=bot%20applications.commands`
    )

  const {
    data: { isAdmin, channels },
    error,
  } = useServerData(serverData.id, {
    swrOptions: {
      refreshInterval: !!activeAddBotPopup ? 2000 : 0,
      refreshWhenHidden: true,
    },
  })

  const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)

  useEffect(() => {
    if (!!prevActiveAddBotPopup && !activeAddBotPopup && isAdmin) {
      onSelect(serverData.id)
    }
  }, [prevActiveAddBotPopup, activeAddBotPopup, isAdmin, onSelect, serverData.id])

  useEffect(() => {
    if (channels?.length > 0 && activeAddBotPopup) {
      activeAddBotPopup.close()
    }
  }, [channels, activeAddBotPopup])

  const { isAlreadyInUse, isUsedInCurrentGuild, guildUrlName, isValidating } =
    usePlatformUsageInfo("DISCORD", serverData.id)

  if (isUsedInCurrentGuild) return null

  return (
    <CardMotionWrapper>
      <OptionCard
        h="max-content"
        title={serverData.name}
        description={serverData.owner ? "Owner" : "Admin"}
        image={serverData.img || "/default_discord_icon.png"}
      >
        {onCancel ? (
          <Button h={10} onClick={onCancel}>
            Cancel
          </Button>
        ) : isValidating ? (
          <Button h={10} isLoading />
        ) : !isAdmin || !!error ? (
          <Button
            h={10}
            colorScheme="DISCORD"
            onClick={openAddBotPopup}
            isLoading={!!activeAddBotPopup}
            rightIcon={<ArrowSquareIn />}
          >
            Add bot
          </Button>
        ) : !isAlreadyInUse ? (
          <Button
            h={10}
            colorScheme="green"
            onClick={() => onSelect(serverData.id)}
            data-test="select-dc-server-button"
          >
            Select
          </Button>
        ) : isAlreadyInUse ? (
          <Button as={Link} href={`/${guildUrlName}`} h={10} colorScheme="gray">
            Go to guild
          </Button>
        ) : null}
      </OptionCard>
    </CardMotionWrapper>
  )
}

export default DCServerCard
