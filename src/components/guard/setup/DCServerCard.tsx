import { usePrevious } from "@chakra-ui/react"
import Button from "components/common/Button"
import OptionCard from "components/common/OptionCard"
import usePopupWindow from "hooks/usePopupWindow"
import useServerData from "hooks/useServerData"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowSquareIn } from "phosphor-react"
import { useEffect } from "react"
import useGuildByPlatformId from "./hooks/useDiscordGuildByPlatformId"

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
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverData.id}&permissions=268717137&scope=bot%20applications.commands`
    )

  const router = useRouter()

  const {
    data: { isAdmin, channels, serverId },
  } = useServerData(serverData.id, {
    refreshInterval: !!activeAddBotPopup ? 2000 : 0,
    refreshWhenHidden: true,
  })

  const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)

  useEffect(() => {
    if (!!prevActiveAddBotPopup && !activeAddBotPopup && isAdmin) {
      onSelect(serverData.id)
    }
  }, [prevActiveAddBotPopup, activeAddBotPopup, isAdmin])

  useEffect(() => {
    if (channels?.length > 0 && activeAddBotPopup) {
      activeAddBotPopup.close()
    }
  }, [channels, activeAddBotPopup])

  const { id, urlName } = useGuildByPlatformId("DISCORD", serverData.id)

  return (
    <OptionCard
      title={serverData.name}
      description={serverData.owner ? "Owner" : "Admin"}
      image={serverData.img || "/default_discord_icon.png"}
    >
      {onCancel ? (
        <Button
          h={10}
          onClick={onCancel}
          data-dd-action-name="Cancel [dc server setup]"
        >
          Cancel
        </Button>
      ) : isAdmin === undefined ? (
        <Button h={10} isLoading />
      ) : !isAdmin ? (
        <Button
          h={10}
          colorScheme="DISCORD"
          onClick={openAddBotPopup}
          isLoading={!!activeAddBotPopup}
          rightIcon={<ArrowSquareIn />}
          data-dd-action-name="Add bot [dc server setup]"
        >
          Add bot
        </Button>
      ) : !id ? (
        <Button
          h={10}
          colorScheme="green"
          onClick={() => onSelect(serverData.id)}
          data-dd-action-name="Select [dc server setup]"
        >
          Select
        </Button>
      ) : id ? (
        <Link
          href={`/${urlName}${
            router.asPath?.includes("guard") ? "?focusGuard=true" : ""
          }`}
          passHref
        >
          <Button
            as="a"
            h={10}
            colorScheme="gray"
            data-dd-action-name="Go to guild [dc server setup]"
          >
            Already guilded
          </Button>
        </Link>
      ) : null}
    </OptionCard>
  )
}

export default DCServerCard
