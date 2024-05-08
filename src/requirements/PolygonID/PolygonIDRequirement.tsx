import {
  Box,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { CaretDown } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import ConnectPolygonID from "./components/ConnectPolygonID"

const PolygonIDRequirement = (props: RequirementProps) => {
  const bg = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const requirement = useRequirementContext()

  const proofAge =
    requirement.data?.maxAmount > 0 &&
    formatRelativeTimeFromNow(requirement.data.maxAmount)

  if (requirement?.data?.query)
    return (
      <Requirement
        image={`/requirementLogos/polygonId.svg`}
        footer={<ConnectPolygonID />}
        {...props}
      >
        <Text as="span">{`Satisfy the `}</Text>
        <DataBlock>{requirement.data.query[0]?.query?.type}</DataBlock>
        <Text as="span">{` PolygonID `}</Text>
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button
              variant="link"
              rightIcon={<Icon as={CaretDown} />}
              iconSpacing={1}
            >
              query
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody
                p={2}
                bgColor={bg}
                borderRadius={"xl"}
                maxH={"md"}
                overflow={"auto"}
              >
                <Box as="pre" fontSize="sm">
                  {JSON.stringify(requirement.data.query, null, 2)}
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Requirement>
    )

  return (
    <Requirement
      image={`/requirementLogos/polygonId.svg`}
      footer={<ConnectPolygonID />}
      {...props}
    >
      {`Authenticate with PolygonID`}
      {requirement.chain !== "POLYGON" && " (on Mumbai)"}
      {proofAge && (
        <>
          {` (valid until `}
          <DataBlock>{proofAge}</DataBlock>
          {`)`}
        </>
      )}
    </Requirement>
  )
}

export default PolygonIDRequirement
