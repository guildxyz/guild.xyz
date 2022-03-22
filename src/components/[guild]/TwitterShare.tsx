import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  ScaleFade,
} from "@chakra-ui/react"
import useGuildMembers from "hooks/useGuildMembers"
import useLocalStorage from "hooks/useLocalStorage"
import { TwitterLogo } from "phosphor-react"
import useGuild from "./hooks/useGuild"

const TwitterShare = () => {
  const guild = useGuild()
  const members = useGuildMembers()

  const [showTwitter, setShowTwitter] = useLocalStorage<boolean>(
    `${guild.id}_showTwitterShare`,
    members.length < 8
  )
  const closeAlert = () => setShowTwitter(false)

  return (
    <ScaleFade in={showTwitter} unmountOnExit>
      <Alert
        mt="-5"
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
          <Button
            as="a"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `Just summoned my guild! Join me on my noble quest: guild.xyz/${guild.urlName}`
            )}`}
            target="_blank"
            leftIcon={<TwitterLogo />}
            colorScheme="white"
            onClick={closeAlert}
            h="10"
          >
            Share
          </Button>
        </HStack>
      </Alert>
    </ScaleFade>
  )
}

export default TwitterShare
