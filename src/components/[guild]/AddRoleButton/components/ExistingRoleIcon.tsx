import { Center, HStack } from "@chakra-ui/react"
import { ArrowRight, DiscordLogo, IdentificationCard } from "phosphor-react"
import React from "react"
import IconWithSparkles from "./IconWithSparkles"

const ExistingRoleIcon = () => (
  <HStack spacing={1}>
    <Center boxSize={"20px"}>
      <DiscordLogo />
    </Center>
    <ArrowRight weight="regular" />
    <IconWithSparkles>
      <IdentificationCard weight="fill" size="20" />
    </IconWithSparkles>
  </HStack>
)

export default ExistingRoleIcon
