import {
  Box,
  Circle,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { Check } from "phosphor-react"
import { Fragment, KeyboardEvent } from "react"
import { GuildFormType, Requirement } from "types"

type Template = {
  name: string
  description?: string
  roles: GuildFormType["roles"]
}

type Props = Template & {
  id: string
  selected?: boolean
  onClick: (newTemplateId: string) => void
}

const TemplateCard = ({
  id,
  name,
  description,
  roles,
  selected,
  onClick,
}: Props): JSX.Element => {
  const bottomBgColor = useColorModeValue("gray.100", "gray.800")
  const roleBottomBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const roleBottomBorderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Box
      tabIndex={0}
      onClick={() => onClick(id)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") return
        e.preventDefault()
        onClick(id)
      }}
      data-dd-action-name={`template: ${id}`}
      position="relative"
      mb={{ base: 4, md: 6 }}
      borderRadius="2xl"
      overflow="hidden"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
      _hover={{
        _before: {
          opacity: 0.1,
        },
      }}
      _focus={{
        outline: "none",
        _before: {
          opacity: 0.1,
        },
      }}
      _active={{
        _before: {
          opacity: 0.17,
        },
      }}
      cursor="pointer"
    >
      <Stack>
        <Stack px={{ base: 5, sm: 6 }} pt={{ base: 5, sm: 6 }}>
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontFamily="display"
          >
            {name}
          </Heading>

          <Text colorScheme="gray" fontWeight="semibold">
            {description}
          </Text>
        </Stack>

        <Stack p={{ base: 5, sm: 6 }} bgColor={bottomBgColor} spacing={4}>
          {roles?.map((role, index) => (
            <Card key={index}>
              <Stack>
                <Stack px={{ base: 5, sm: 6 }} pt={{ base: 5, sm: 6 }} pb={4}>
                  <Heading
                    as="h3"
                    fontSize={{ base: "md", md: "lg" }}
                    fontFamily="display"
                  >
                    {role.name}
                  </Heading>
                </Stack>

                <Stack
                  p={{ base: 5, sm: 6 }}
                  bgColor={roleBottomBgColor}
                  borderTopWidth={1}
                  borderTopColor={roleBottomBorderColor}
                >
                  <Text
                    as="span"
                    mt={1}
                    mr={2}
                    mb={2}
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray"
                    textTransform="uppercase"
                    noOfLines={1}
                  >
                    Requirements to qualify
                  </Text>

                  {role.requirements.map((requirement, i) => (
                    <Fragment key={i}>
                      <RequirementDisplayComponent
                        simple
                        requirement={requirement as Requirement}
                      />
                      {i < role.requirements.length - 1 && (
                        <LogicDivider logic="AND" py={1} />
                      )}
                    </Fragment>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      <Flex
        position="absolute"
        inset={0}
        justifyContent="end"
        px={{ base: 5, sm: 6 }}
        py={7}
        borderWidth={2}
        borderStyle={selected ? "solid" : "dashed"}
        borderColor={selected && "green.500"}
        borderRadius="2xl"
        pointerEvents="none"
        transition="border 0.16s ease"
      >
        <Circle
          bgColor="green.500"
          color="white"
          size={6}
          transition="opacity 0.16s ease"
          opacity={selected ? 1 : 0}
        >
          <Icon as={Check} />
        </Circle>
      </Flex>
    </Box>
  )
}

export default TemplateCard
export type { Template }
