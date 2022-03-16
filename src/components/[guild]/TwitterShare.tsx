import {
  Alert,
  AlertDescription,
  Button,
  Center,
  CloseButton,
  Fade,
  Flex,
  HStack,
  useBreakpointValue,
  usePrevious,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import useGuildMembers from "hooks/useGuildMembers"
import useLocalStorage from "hooks/useLocalStorage"
import { TwitterLogo } from "phosphor-react"
import { useCallback, useEffect, useMemo } from "react"
import useGuild from "./hooks/useGuild"
import useIsOwner from "./hooks/useIsOwner"

const TwitterShare = () => {
  const guild = useGuild()
  const isOwner = useIsOwner()
  const [isTwitterShareClosed, setIsTwitterShareClosed] = useLocalStorage(
    `${guild?.id}-twitter-closed`,
    {
      created: !isOwner,
      newRole: !isOwner,
      joined: false,
    }
  )
  const members = useGuildMembers()

  const prevGuild = usePrevious(guild)
  useEffect(() => {
    if (prevGuild?.roles.length < guild?.roles.length) {
      setIsTwitterShareClosed({ ...isTwitterShareClosed, newRole: false })
    }
  }, [guild, prevGuild])

  const [firstLine, secondLine, twitterLink] = useMemo(
    () =>
      !isTwitterShareClosed.created
        ? [
            "Congratulations, your guild is successfully created!",
            "Summon your members by sharing it on Twitter.",
            `https://twitter.com/intent/tweet?text=Just%20summoned%20my%20guild!%20Join%20me%20on%20my%20noble%20quest%2C%20or%20make%20your%20own.%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`,
          ]
        : !isTwitterShareClosed.joined
        ? [
            `Congratulations, you just joined "${guild.name}" guild!`,
            "Proud of you! Let others know as well and share it in a tweet.",
            `https://twitter.com/intent/tweet?text=Just%20joined%20a%20brand%20new%20guild.%0AContinuing%20my%20brave%20quest%20to%20explore%20all%20corners%20of%20web3!%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`,
          ]
        : [
            "Congratulations, your new role is successfully added to your guild!",
            "Let your guild know about the new role by sharing it with them on Twitter.",
            `https://twitter.com/intent/tweet?text=Hey%2C%20I%20just%20added%20a%20new%20role%20to%20my%20guild.%20Check%20it%20out%2C%20maybe%20you%20have%20access%20%F0%9F%98%89%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`,
          ],
    [isTwitterShareClosed, guild]
  )

  const renderTextInHStack = useBreakpointValue({ base: false, md: true })
  const justifyContent = useBreakpointValue({ base: "space-between", md: "normal" })
  const alertProps = useBreakpointValue<{
    whiteSpace: "normal" | "nowrap"
    width: "md" | "min"
  }>({
    base: { whiteSpace: "normal", width: "md" },
    md: { whiteSpace: "nowrap", width: "min" },
  })

  const isClosed = useMemo(
    () =>
      !!isTwitterShareClosed[
        !isTwitterShareClosed.created
          ? "created"
          : !isTwitterShareClosed.joined
          ? "joined"
          : "newRole"
      ],
    [isTwitterShareClosed]
  )

  const handleClose = useCallback(
    () =>
      setIsTwitterShareClosed({
        ...isTwitterShareClosed,
        [!isTwitterShareClosed.created
          ? "created"
          : !isTwitterShareClosed.joined
          ? "joined"
          : "newRole"]: true,
      }),
    [isTwitterShareClosed]
  )

  if (!isOwner && !!isTwitterShareClosed.joined) return null

  return (
    <Fade in={!isClosed} unmountOnExit>
      <Center
        mt={members?.length > 0 ? 0 : 5}
        position="fixed"
        bottom={8}
        left="50%"
        transform="translateX(-50%)"
      >
        <Alert
          status="info"
          colorScheme="twitter"
          {...alertProps}
          bgColor="twitter.500"
          color="white"
        >
          <Flex flexDirection="column" w="full">
            <HStack spacing={2} justifyContent={justifyContent}>
              <Link
                href={twitterLink}
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

              {renderTextInHStack && (
                <AlertDescription>{secondLine}</AlertDescription>
              )}

              <CloseButton onClick={handleClose} />
            </HStack>
            {!renderTextInHStack && (
              <AlertDescription>{secondLine}</AlertDescription>
            )}
          </Flex>
        </Alert>
      </Center>
    </Fade>
  )
}

export default TwitterShare
