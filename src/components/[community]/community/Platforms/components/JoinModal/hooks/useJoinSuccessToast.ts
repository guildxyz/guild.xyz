import { usePrevious, useToast } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import platformsContent from "components/[community]/community/Platforms/platformsContent"
import { useEffect, useState } from "react"
import useIsMember from "../../PlatformButton/hooks/useIsMember"

const useJoinSuccessToast = (platform: string) => {
  const { account } = useWeb3React()
  const isMember = useIsMember(platform)
  const prevIsMember = usePrevious(isMember)
  const toast = useToast()
  const [prevAccount, setPrevAccount] = useState(account)

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
      title: `Successfully joined ${platformsContent[platform].title}`,
      description:
        platform === "telegram"
          ? "Medousa will send you the links to the actual groups"
          : undefined,
      position: "top-right",
      status: "success",
      variant: "toastSubtle",
      isClosable: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMember, account, platform, toast]) // intentionally leaving prevIsMember and prevAccount out
}

export default useJoinSuccessToast
