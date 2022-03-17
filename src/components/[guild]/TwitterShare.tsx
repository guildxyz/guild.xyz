import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Fade,
  HStack,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import useGuildMembers from "hooks/useGuildMembers"
import useLocalStorage from "hooks/useLocalStorage"
import { TwitterLogo } from "phosphor-react"
import useGuild from "./hooks/useGuild"
import useIsOwner from "./hooks/useIsOwner"

const TwitterShare = () => {
  const { account } = useWeb3React()
  const guild = useGuild()
  const isOwner = useIsOwner()
  const [isTwitterShareClosed, setIsTwitterShareClosed] = useLocalStorage(
    `${guild?.urlName}_alert_closed`,
    false
  )
  const members = useGuildMembers()

  const alertProps = useBreakpointValue<{
    whiteSpace: "normal" | "nowrap"
    minWidth: "sm" | "md" | "min"
  }>({
    base: { whiteSpace: "normal", minWidth: "sm" },
    sm: { whiteSpace: "normal", minWidth: "md" },
    md: { whiteSpace: "nowrap", minWidth: "min" },
  })

  if (!account || !isOwner || isTwitterShareClosed) return null

  return (
    <Fade in={!isTwitterShareClosed} unmountOnExit>
      <Alert
        mt={members?.length > 0 ? 0 : 5}
        status="info"
        colorScheme="twitter"
        {...alertProps}
        bgColor="twitter.500"
        color="white"
        w="min"
        pr={10}
      >
        <CloseButton
          onClick={() => setIsTwitterShareClosed(true)}
          position="absolute"
          right="8px"
          top="8px"
        />
        <AlertIcon mt={0} />
        <VStack w="full" spacing={1} alignItems="start">
          <AlertTitle>Summon your members by sharing it on Twitter.</AlertTitle>
          <HStack justifyContent="end" w="full">
            <Link
              href={`https://twitter.com/intent/tweet?text=Just%20summoned%20my%20guild!%20Join%20me%20on%20my%20noble%20quest%2C%20or%20create%20your%20own%20with%20guild.%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`}
              target="_blank"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                variant="ghost"
                leftIcon={<TwitterLogo />}
                colorScheme="white"
                size="sm"
              >
                Share
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Alert>
    </Fade>
  )
}

export default TwitterShare
