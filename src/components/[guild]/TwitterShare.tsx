import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  ScaleFade,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import useGuildMembers from "hooks/useGuildMembers"
import useLocalStorage from "hooks/useLocalStorage"
import { TwitterLogo } from "phosphor-react"
import useGuild from "./hooks/useGuild"
import useGuildPermission from "./hooks/useGuildPermission"

const TwitterShare = () => {
  const { account } = useWeb3React()
  const guild = useGuild()
  const { isOwner } = useGuildPermission()
  const members = useGuildMembers()

  const [showTwitter, setShowTwitter] = useLocalStorage<boolean>(
    `${guild.id}_showTwitterShare`,
    members.length < 8
  )
  const closeAlert = () => setShowTwitter(false)

  if (!account || !isOwner) return null

  return (
    <ScaleFade in={showTwitter} unmountOnExit>
      <Alert
        px={{ base: 4, md: 6 }}
        pt={{ base: 5, md: 4 }}
        status="info"
        colorScheme="twitter"
        variant={"solid"}
        w="full"
        bgColor="twitter.500"
        color="white"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ md: "center" }}
      >
        <HStack spacing={"0"}>
          <AlertIcon mt={"1px"} />
          <AlertTitle>Summon members by sharing your guild on Twitter</AlertTitle>
        </HStack>
        <HStack ml="auto" mt={{ base: 6, md: 0 }}>
          <Button variant={"ghost"} onClick={closeAlert} h="10">
            Dismiss
          </Button>
          <Link
            href={`https://twitter.com/intent/tweet?text=Just%20summoned%20my%20guild!%20Join%20me%20on%20my%20noble%20quest%2C%20or%20create%20your%20own%20with%20guild.%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`}
            target="_blank"
            _hover={{ textDecoration: "none" }}
          >
            <Button
              leftIcon={<TwitterLogo />}
              colorScheme="white"
              onClick={closeAlert}
              h="10"
            >
              Share
            </Button>
          </Link>
        </HStack>
      </Alert>
    </ScaleFade>
  )
}

export default TwitterShare
