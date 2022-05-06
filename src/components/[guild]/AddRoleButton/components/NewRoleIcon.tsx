import { Center, HStack } from "@chakra-ui/react"
import { ArrowRight, DiscordLogo, IdentificationCard } from "phosphor-react"
import React from "react"
import IconWithSparkles from "./IconWithSparkles"

const NewRoleIcon = () => (
  <HStack spacing={1}>
    <IconWithSparkles>
      <IdentificationCard weight="fill" size="20" />
    </IconWithSparkles>
    <ArrowRight weight="regular" />
    <IconWithSparkles>
      <Center boxSize={"20px"}>
        <DiscordLogo />
      </Center>
    </IconWithSparkles>
  </HStack>
)

export default NewRoleIcon
