import { Button, HStack, Text, usePrevious } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/RolesByPlatform/hooks/useIsMember"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { PlatformName } from "../../../platformsContent"

const useJoinSuccessToast = (onClose, platform: PlatformName) => {
  const { account } = useWeb3React()
  const toast = useToast()
  const [prevAccount, setPrevAccount] = useState(account)
  const isMember = useIsMember()
  const prevIsMember = usePrevious(isMember)
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const { name } = useGuild()

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
      title: `Congratulations, you just joined "${name}" guild!`,
      description: (
        <>
          <Text>Proud of you! Let others know as well and share it in a tweet.</Text>
          <HStack justifyContent="end" mt={2}>
            <Link
              href={`https://twitter.com/intent/tweet?text=Just%20joined%20a%20brand%20new%20guild.%0AContinuing%20my%20brave%20quest%20to%20explore%20all%20corners%20of%20web3!%0Ahttps%3A%2F%2Fguild.xyz%2F${router.query.guild}`}
              target="_blank"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                leftIcon={<TwitterLogo weight="fill" />}
                colorScheme="twitter"
                size="sm"
              >
                Share
              </Button>
            </Link>
          </HStack>
        </>
      ),
      status: "success",
    })
    onClose()
    if (router.query.guild) mutate(`/guild/${router.query.guild}`)
    mutate(`/guild/${account}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMember, account, platform, toast, name]) // intentionally leaving prevIsMember and prevAccount out
}

export default useJoinSuccessToast
