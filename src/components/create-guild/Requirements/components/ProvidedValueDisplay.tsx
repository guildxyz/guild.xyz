import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Circle,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Info, Lightning, Question } from "phosphor-react"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { Requirement } from "types"

const ProvidedValueDisplay = ({
  requirement,
}: {
  requirement: Partial<Requirement>
}) => {
  const bg = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

  const ValueDisplayComponent = REQUIREMENT_PROVIDED_VALUES[requirement.type]

  return (
    <>
      <Accordion allowToggle>
        <AccordionItem border={"none"}>
          <AccordionButton
            display={"flex"}
            rounded={"lg"}
            fontWeight={"semibold"}
            px={0}
            opacity={0.5}
            _hover={{ opacity: 1 }}
          >
            <Icon as={Info} mr={2} />
            Provides dynamic value
            <AccordionIcon ml={"auto"} />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Card px={5} py={3} bg={bg} boxShadow={"none"}>
              <HStack gap={3} alignItems={"center"} display={"flex"}>
                <Circle
                  position="relative"
                  bgColor={"white"}
                  size={9}
                  overflow="hidden"
                >
                  <Icon boxSize={5} as={Lightning} weight="fill" color="green.500" />
                </Circle>

                <Stack gap={0} w="full">
                  <Text color="GrayText" fontSize={"sm"}>
                    Dynamic value
                  </Text>
                  <Text fontWeight={"semibold"} mt={-0.5}>
                    <ValueDisplayComponent requirement={requirement} />
                  </Text>
                </Stack>

                <Tooltip
                  label="This requirement provides a dynamic value, which you can use when setting up dynamic rewards."
                  hasArrow
                >
                  <Icon
                    boxSize={5}
                    weight="regular"
                    as={Question}
                    color="GrayText"
                  />
                </Tooltip>
              </HStack>
            </Card>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default ProvidedValueDisplay
