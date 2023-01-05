import {
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
import { Fragment } from "react"

type Layout = {
  id: string
  name: string
  description?: string
  requirements: any[] // TODO
}

type Props = Layout & { selected?: boolean; onClick: (newLayoutId: string) => void }

const LayoutCard = ({
  id,
  name,
  description,
  requirements,
  selected,
  onClick,
}: Props): JSX.Element => {
  const bottomBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const bottomBorderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Card
      onClick={() => onClick(id)}
      position="relative"
      mb={{ base: 4, md: 6 }}
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
      _active={{
        _before: {
          opacity: 0.17,
        },
      }}
      cursor="pointer"
    >
      <Stack>
        <Stack px={{ base: 5, sm: 6 }} pt={7} pb={3}>
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

        <Stack
          px={{ base: 5, sm: 6 }}
          py={7}
          bgColor={bottomBgColor}
          borderTopWidth={1}
          borderTopColor={bottomBorderColor}
        >
          <Text
            as="span"
            mt="1"
            mr="2"
            fontSize="xs"
            fontWeight="bold"
            color="gray"
            textTransform="uppercase"
            noOfLines={1}
          >
            Requirements to qualify
          </Text>

          {requirements.map((requirement, i) => (
            <Fragment key={i}>
              {/* TODO: make a simplified requirement list component and use that here */}
              <RequirementDisplayComponent requirement={requirement} />
              {i < requirements.length - 1 && <LogicDivider logic="AND" />}
            </Fragment>
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
        borderColor="green.500"
        borderRadius="2xl"
        pointerEvents="none"
        transition="opacity 0.16s ease"
        opacity={selected ? 1 : 0}
      >
        <Circle bgColor="green.500" color="white" size={6}>
          <Icon as={Check} />
        </Circle>
      </Flex>
    </Card>
  )
}

export default LayoutCard
export type { Layout }
