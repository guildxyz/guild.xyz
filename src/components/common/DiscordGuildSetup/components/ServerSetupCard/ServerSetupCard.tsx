import { Box, SimpleGrid, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import useSetImageAndNameFromPlatformData from "components/create-guild/hooks/useSetImageAndNameFromPlatformData"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { AnimatePresence, motion } from "framer-motion"
import usePinata from "hooks/usePinata"
import useServerData from "hooks/useServerData"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { useContext, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const MotionStack = motion(Stack)

const ServerSetupCard = ({ children, onSubmit: onSubmitProp }): JSX.Element => {
  const router = useRouter()

  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  const { control, setValue } = useFormContext<GuildFormType>()

  const selectedServer = useWatch({
    control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const {
    data: { serverIcon, serverName },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const [watchedVideo, setWatchedVideo] = useState(
    router.pathname.includes("/create-guild")
  )

  const { onUpload } = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`)
    },
    onError: () => {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
    },
  })

  useSetImageAndNameFromPlatformData(serverIcon, serverName, onUpload)

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <AnimatePresence initial={false} exitBeforeEnter>
            <MotionStack
              key={watchedVideo ? "form" : "video"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              spacing={8}
            >
              {watchedVideo ? children : <DiscordRoleVideo />}
            </MotionStack>
          </AnimatePresence>

          <SimpleGrid columns={2} gap={4}>
            {watchedVideo ? (
              <>
                <Button
                  colorScheme="gray"
                  disabled={!!account}
                  onClick={openWalletSelectorModal}
                  rightIcon={!!account && <Check />}
                  data-dd-action-name="Connect wallet [dc server setup]"
                >
                  {!account ? "Connect wallet" : "Wallet connected"}
                </Button>

                <Button
                  colorScheme="green"
                  disabled={!account}
                  onClick={() => onSubmitProp?.()}
                >
                  Got it
                </Button>
              </>
            ) : (
              <>
                <Box />
                <Button
                  colorScheme="green"
                  onClick={() => {
                    onSubmitProp?.()
                    if (onSubmitProp) return
                    setWatchedVideo(true)
                  }}
                >
                  Got it
                </Button>
              </>
            )}
          </SimpleGrid>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default ServerSetupCard
