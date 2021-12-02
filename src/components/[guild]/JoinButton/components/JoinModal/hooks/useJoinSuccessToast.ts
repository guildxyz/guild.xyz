import { usePrevious } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useIsMember from "components/[guild]/JoinButton/hooks/useIsMember"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"

const useJoinSuccessToast = (guildId: number, onClose, platform = "discord") => {
  const { account } = useWeb3React()
  const toast = useToast()
  const [prevAccount, setPrevAccount] = useState(account)
  const isMember = useIsMember("guild", guildId)
  const prevIsMember = usePrevious(isMember)
  const { mutate } = useSWRConfig()
  const router = useRouter()

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

    toast({
      title: `Successfully joined ${
        platform === "telegram" ? "Telegram" : "Discord"
      }`,
      description:
        platform === "telegram"
          ? "Agora will send you the links to the actual groups"
          : undefined,
      status: "success",
    })
    onClose()
    if (router.query.hall) mutate(`/guild/urlName/${router.query.hall}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMember, account, platform, toast]) // intentionally leaving prevIsMember and prevAccount out
}

export default useJoinSuccessToast
