import {
  Avatar,
  AvatarBadge,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import platforms from "platforms/platforms"
import { PropsWithChildren } from "react"
import { PlatformName } from "types"

const MotionHStack = motion(HStack)

const SocialAccountUI = ({
  type,
  avatarUrl,
  username,
  isConnected,
  children,
}: PropsWithChildren<{
  type: PlatformName
  avatarUrl?: string
  username?: string
  isConnected?: boolean
}>) => {
  const { icon, name, colorScheme } = platforms[type]
  const circleBorderColor = useColorModeValue("gray.100", "gray.700")

  return (
    <MotionHStack layout spacing={3} alignItems="center" w="full">
      {!!avatarUrl ? (
        <Avatar src={avatarUrl} size="sm" boxSize={7}>
          <AvatarBadge
            boxSize={5}
            bgColor={`${colorScheme}.500`}
            borderWidth={1}
            borderColor={circleBorderColor}
          >
            <Icon as={icon} boxSize={3} color="white" />
          </AvatarBadge>
        </Avatar>
      ) : (
        <Avatar
          icon={<Icon as={icon} boxSize={4} color="white" />}
          boxSize={7}
          bgColor={`${colorScheme}.500`}
        />
      )}
      <Text fontWeight="bold" flex="1" noOfLines={1} fontSize="sm">
        {username ?? `${platforms[type].name} ${isConnected ? "connected" : ""}`}
      </Text>
      {children}
    </MotionHStack>
  )
}

export default SocialAccountUI
