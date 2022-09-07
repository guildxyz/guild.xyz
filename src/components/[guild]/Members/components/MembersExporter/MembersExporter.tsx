import {
  Box,
  Checkbox,
  CheckboxGroup,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useBreakpointValue,
  useClipboard,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { Copy, DownloadSimple, Export, Users } from "phosphor-react"
import { useState } from "react"

const MembersExporter = (): JSX.Element => {
  const label = useBreakpointValue({ base: "Export", sm: "Export members" })

  const { roles } = useGuild()
  const [selectedRoles, setSelectedRoles] = useState([])

  // Returning only unique members
  const membersList = [
    ...new Set(
      roles
        ?.filter((role) => selectedRoles.includes(role.id.toString()))
        ?.map((role) => role.members)
        ?.reduce((a, b) => a.concat(b), [])
        ?.filter((member) => !!member) ?? []
    ),
  ]

  const { hasCopied, onCopy } = useClipboard(membersList.join("\n"))

  const exportMembersAsCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + membersList.join("\n")
    const encodedUri = encodeURI(csvContent)
    window.open(encodedUri, "_blank")
  }

  // Wrapping the Popover in a div, so we don't get popper.js warnings in the console
  return (
    <Box>
      <Popover openDelay={0}>
        <PopoverTrigger>
          <Button
            aria-label="Export members"
            variant="ghost"
            leftIcon={<Icon as={Export} />}
            size="sm"
            data-dd-action-name="Export members"
          >
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton rounded="full" />
          <PopoverHeader fontSize="sm" fontWeight="bold">
            Select roles to export members of
          </PopoverHeader>
          <PopoverBody>
            <CheckboxGroup
              onChange={(newList) => setSelectedRoles(newList)}
              colorScheme="primary"
            >
              {roles?.map((role) => (
                <Checkbox
                  w="full"
                  mb={1.5}
                  key={role.id}
                  value={role.id.toString()}
                  size="sm"
                  isDisabled={!role.members?.length}
                >
                  <HStack>
                    <Text as="span">{role.name}</Text>
                    <Tag size="sm">
                      <TagLeftIcon>
                        <Icon as={Users} size={24} />
                      </TagLeftIcon>
                      <TagLabel>{`${role.members?.length ?? 0}`}</TagLabel>
                    </Tag>
                  </HStack>
                </Checkbox>
              ))}
            </CheckboxGroup>

            <Wrap spacing={1} mt={3} mb={4}>
              <Button
                size="xs"
                pt="1px"
                rounded="md"
                onClick={onCopy}
                disabled={!membersList.length}
                leftIcon={<Copy />}
              >
                {`${hasCopied ? "Copied" : "Copy"} addresses`}
              </Button>
              <Button
                size="xs"
                pt="1px"
                rounded="md"
                onClick={exportMembersAsCsv}
                disabled={!membersList.length}
                leftIcon={<DownloadSimple />}
              >
                Export addresses
              </Button>
            </Wrap>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default MembersExporter
