/**
 * Accordion-ban egy-egy requirement setup (monetization valamint voice
 * participation) Accordion icon-t customizálni (checked/unchecked)
 */

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Circle,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Check } from "phosphor-react"
import { useCreatePoapContext } from "../CreatePoapContext"
import MonetizePoap from "./components/MonetizePoap"
import VoiceParticipation from "./components/VoiceParticipation"

const Requirements = (): JSX.Element => {
  const { nextStep } = useCreatePoapContext()

  return (
    <Stack spacing={8}>
      <Accordion allowMultiple allowToggle borderColor="transparent">
        <AccordionItem borderWidth={0}>
          {({ isExpanded }) => (
            <>
              <AccordionButton px={0} _hover={{ bgColor: "transparent" }}>
                <HStack>
                  <Circle
                    size="5"
                    border="1px"
                    {...(isExpanded
                      ? {
                          bg: "green.500",
                          borderColor: "green.500",
                        }
                      : { bg: "blackAlpha.100", borderColor: "whiteAlpha.100" })}
                  >
                    {isExpanded && <Icon as={Check} weight="bold" color="white" />}
                  </Circle>
                  <Text w="full" fontWeight="bold" isTruncated>
                    Voice requirement
                  </Text>
                </HStack>
              </AccordionButton>

              <AccordionPanel px={0} pt={4}>
                <VoiceParticipation />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>

        <AccordionItem borderWidth={0}>
          {({ isExpanded }) => (
            <>
              <AccordionButton px={0} _hover={{ bgColor: "transparent" }}>
                <HStack>
                  <Circle
                    size="5"
                    border="1px"
                    {...(isExpanded
                      ? {
                          bg: "green.500",
                          borderColor: "green.500",
                        }
                      : { bg: "blackAlpha.100", borderColor: "whiteAlpha.100" })}
                  >
                    {isExpanded && <Icon as={Check} weight="bold" color="white" />}
                  </Circle>
                  <Text w="full" fontWeight="bold" isTruncated>
                    Monetization
                  </Text>
                </HStack>
              </AccordionButton>

              <AccordionPanel px={0} pt={4}>
                <MonetizePoap />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      <Flex justifyContent="end">
        <Button onClick={nextStep}>Continue to distribution</Button>
      </Flex>
    </Stack>
  )
}

export default Requirements
