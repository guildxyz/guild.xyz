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
  useColorModeValue,
} from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { CaretDown } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import ConnectPolygonID from "./components/ConnectPolygonID"

const PolygonIDRequirement = (props: RequirementProps) => {
  const bg = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const requirement = useRequirementContext()

  const proofAge =
    requirement.data.maxAmount > 0 &&
    formatRelativeTimeFromNow(requirement.data.maxAmount)

  if (requirement?.data?.query)
    return (
      <Requirement
        image={`/requirementLogos/polygonId.svg`}
        footer={<ConnectPolygonID />}
        {...props}
      >
        {`Satisfy a PolygonID `}
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
              <PopoverBody p={0}>
                <Box
                  overflow="auto"
                  as="pre"
                  p={2}
                  bgColor={bg}
                  borderRadius="sm"
                  fontSize="sm"
                >
                  {JSON.stringify(requirement.data.query, null, 2)}
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        {proofAge && (
          <>
            {` (valid until `}
            <DataBlock>{proofAge}</DataBlock>
            {`)`}
          </>
        )}
      </Requirement>
    )

  return (
    <Requirement
      image={`/requirementLogos/polygonId.svg`}
      footer={<ConnectPolygonID />}
      {...props}
    >
      {`Authenticate with PolygonID`}
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
