import {
  Circle,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import LogicDivider from "components/[guild]/LogicDivider"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { Coins } from "phosphor-react"
import { Fragment } from "react"
import { Logic, Requirement } from "types"

type Props = {
  requirements: Requirement[]
  logic: Logic
}

const RequirementsCard = ({ requirements, logic }: Props) => {
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")

  const paymentImageBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <Card layout w="full" h="max-content">
      <Stack
        p={{ base: 5, md: 8 }}
        bgColor={requirementsSectionBgColor}
        spacing={{ base: 4, md: 8 }}
      >
        <Text
          as="span"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          textTransform="uppercase"
          noOfLines={1}
        >
          Requirements to qualify
        </Text>

        <Stack spacing={0}>
          {requirements.map((requirement, i) => (
            <Fragment key={requirement.id}>
              <RequirementDisplayComponent requirement={requirement} />
              {i < requirements.length - 1 && <LogicDivider logic={logic} />}
            </Fragment>
          ))}

          <LogicDivider logic="+ minting fee" />
          <HStack spacing={4}>
            <Circle bgColor={paymentImageBg} size={"var(--chakra-space-11)"}>
              <Icon as={Coins} boxSize={6} />
            </Circle>

            <Text wordBreak="break-word">
              <DataBlock>1 MATIC</DataBlock>
              {" + gas"}
            </Text>
          </HStack>
        </Stack>

        <Button colorScheme="green">Mint</Button>
      </Stack>
    </Card>
  )
}

export default RequirementsCard
