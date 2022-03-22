import { Button, Text, ToastId, usePrevious } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { useSWRConfig } from "swr"
import useIsMember from "../../../hooks/useIsMember"
import { PlatformName } from "../../../platformsContent"

const useJoinSuccessToast = (onClose, platform: PlatformName) => {
  const { account } = useWeb3React()
  const toast = useToast()
  const [prevAccount, setPrevAccount] = useState(account)
  const isMember = useIsMember()
  const prevIsMember = usePrevious(isMember)
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const toastIdRef = useRef<ToastId>()
  const guild = useGuild()

  useEffect(() => {
    /**
     * Since it's a state left out of the dependency array, prevAccount will only
     * have this newly set value in the next cycle. Not using usePrevious for this
     * because we want to tie it to this useEffect's lifecycle, not account's. That
     * way it'd always be different from the current account, not just for the first
     * time on account change
     */
    setPrevAccount(account)

    if (
      // skip when isMember first gets value after mount
      prevIsMember === undefined ||
      // skip if isMember was already true and the effect runs because of something else
      prevIsMember === true ||
      // skip if isMember has changed because of account change
      prevAccount !== account ||
      !isMember
    )
      return null

    toastIdRef.current = toast({
      title: `Successfully joined guild`,
      duration: 8000,
      description: (
        <>
          <Text>Let others know as well by sharing it on Twitter</Text>
          <Button
            as="a"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `Just joined the ${guild.name} guild. Continuing my brave quest to explore all corners of web3!
guild.xyz/${guild.urlName}`
            )}`}
            target="_blank"
            leftIcon={<TwitterLogo weight="fill" />}
            size="sm"
            onClick={() => toast.close(toastIdRef.current)}
            mt={3}
            mb="1"
            borderRadius="lg"
          >
            Share
          </Button>
        </>
      ),
      status: "success",
    })
    onClose()
    if (router.query.guild) mutate(`/guild/${router.query.guild}`)
    mutate(`/guild/${account}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMember, account, platform, toast]) // intentionally leaving prevIsMember and prevAccount out
}

export default useJoinSuccessToast
