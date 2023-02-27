import {
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Info } from "phosphor-react"
import usePoapLinks from "../hooks/usePoapLinks"
import { useCreatePoapContext } from "./CreatePoapContext"

export default function PoapSuccessCard() {
  const { poapData } = useCreatePoapContext()
  const { poapLinks } = usePoapLinks(poapData?.id)

  return (
    <Card
      p={4}
      flexDirection="row"
      alignItems="center"
      w="full"
      borderWidth="2px"
      borderColor="gray.500"
      borderStyle="dashed"
    >
      <SkeletonCircle boxSize={16} mr="4" isLoaded={!!poapData?.image_url}>
        <Img
          src={poapData?.image_url}
          alt={poapData?.name}
          boxSize={16}
          rounded="full"
        />
      </SkeletonCircle>
      <VStack alignItems="start">
        <Skeleton isLoaded={!!poapData}>
          <Text fontFamily="display" fontWeight="bold">
            {poapData ? poapData?.name : "Unknown POAP"}
            <Text as="span" fontWeight={"semibold"} colorScheme={"gray"} ml="1">
              {` #${poapData?.id}`}
            </Text>
          </Text>
        </Skeleton>

        <Skeleton isLoaded={!!poapLinks}>
          {poapLinks?.total ? (
            <Text colorScheme="gray">{`${poapLinks.total} available`}</Text>
          ) : (
            <Text colorScheme={"gray"}>
              Minting links not uploaded yet
              <Tooltip
                label="The POAP Curation Body will review your POAP, and you'll receive an email with the minting links that you’ll have to upload"
                hasArrow
              >
                <Icon as={Info} mb="-2px" ml="2" />
              </Tooltip>
            </Text>
          )}
        </Skeleton>
      </VStack>
    </Card>
  )
}
