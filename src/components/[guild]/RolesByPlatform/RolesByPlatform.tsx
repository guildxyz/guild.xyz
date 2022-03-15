import {
  Button,
  HStack,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
  useBreakpointValue,
  useColorMode,
  usePrevious,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Link from "components/common/Link"
import JoinButton from "components/[guild]/RolesByPlatform/components/JoinButton"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { PropsWithChildren, useEffect, useMemo, useState } from "react"
import { PlatformName } from "types"
import useGuild from "../hooks/useGuild"
import useIsOwner from "../hooks/useIsOwner"
import Platform from "./components/Platform"
import useIsMember from "./hooks/useIsMember"

type Props = {
  platformType: PlatformName
  platformName: string
  roleIds: Array<number>
}

const RolesByPlatform = ({
  platformType,
  platformName,
  roleIds,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { account } = useWeb3React()
  const { colorMode } = useColorMode()
  const router = useRouter()
  const isOwner = useIsOwner()

  const isMember = useIsMember()
  const prevIsMember = usePrevious(isMember)
  const [justJoined, setJustJoined] = useState<boolean>(false)
  useEffect(() => {
    if (prevIsMember === false && isMember) {
      setPopoverClosed(false)
      setJustJoined(true)
    }
  }, [isMember, prevIsMember])

  const guild = useGuild()
  const prevGuild = usePrevious(guild)
  const [isNewRole, setIsNewRole] = useState<boolean>(false)
  useEffect(() => {
    if (prevGuild?.roles.length < guild?.roles.length) {
      setPopoverClosed(false)
      setIsNewRole(true)
    }
  }, [guild, prevGuild])

  const [shouldShowPopover, setShouldShowPopover] = useState<boolean>(false)
  const [popoverClosed, setPopoverClosed] = useState<boolean>(false)

  useEffect(() => {
    setShouldShowPopover(false)
    setTimeout(() => {
      setShouldShowPopover(true)
    }, 2000)
  }, [account])

  const popoverPlacement = useBreakpointValue<"bottom" | "right">({
    base: "bottom",
    md: "right",
  })

  const [popoverFirstLine, popoverSecondLine, popoverTwitterLink] = useMemo(
    () =>
      isNewRole
        ? [
            "Congratulations, your new role is successfully added to your guild!",
            "Let your guild know by sharing it with them on Twitter.",
            `https://twitter.com/intent/tweet?text=Hey%2C%20I%20just%20added%20a%20new%20role%20to%20my%20guild.%20Check%20it%20out%2C%20maybe%20you%20have%20access%20%F0%9F%98%89%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`,
          ]
        : justJoined
        ? [
            `Congratulations, you just joined "${guild.name}" guild!`,
            "Proud of you! Let others know as well and share it in a tweet.",
            `https://twitter.com/intent/tweet?text=Just%20joined%20a%20brand%20new%20guild.%0AContinuing%20my%20brave%20quest%20to%20explore%20all%20corners%20of%20web3!%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`,
          ]
        : [
            "Congratulations, your guild is successfully created!",
            "Summon your members by sharing it on Twitter.",
            `https://twitter.com/intent/tweet?text=Just%20summoned%20my%20guild!%20Join%20me%20on%20my%20noble%20quest%2C%20or%20make%20your%20own.%0Ahttps%3A%2F%2Fguild.xyz%2F${guild.urlName}`,
          ],
    [isNewRole, justJoined, guild]
  )

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 3, sm: 4 }}
        justifyContent="space-between"
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        {isOwner && (router.query.showShare || isNewRole) ? (
          <HStack spacing={4}>
            <Platform type={platformType} name={platformName} />
            <Popover
              placement={popoverPlacement}
              isOpen={shouldShowPopover && !popoverClosed}
            >
              <PopoverContent
                w="min"
                bgGradient="conic(from 4.9rad at 0% 150%, gray.200, gray.200, twitter.500, gray.200)"
                bgBlendMode="color"
                boxShadow="md"
                borderWidth={2}
              >
                <PopoverArrow />
                <PopoverCloseButton onClick={() => setPopoverClosed(true)} />
                <PopoverBody bgColor="gray.700" borderRadius={"9px"}>
                  <Text fontSize="sm" whiteSpace="nowrap" mr={6}>
                    {popoverFirstLine}
                  </Text>
                  <Text fontSize="sm" whiteSpace="nowrap" mr={6}>
                    {popoverSecondLine}
                  </Text>
                </PopoverBody>
              </PopoverContent>

              <Link
                position="relative"
                href={popoverTwitterLink}
                target="_blank"
                _hover={{ textDecoration: "none" }}
                onClick={() => setPopoverClosed(true)}
              >
                <PopoverAnchor>
                  <Button
                    colorScheme="twitter"
                    size="sm"
                    variant="ghost"
                    leftIcon={<TwitterLogo />}
                  >
                    Share
                  </Button>
                </PopoverAnchor>
              </Link>
            </Popover>
          </HStack>
        ) : (
          <Platform type={platformType} name={platformName} />
        )}
        <JoinButton platform={platformType} roleIds={roleIds} />
      </HStack>

      {children}
    </Card>
  )
}

export default RolesByPlatform
