import {
  Box,
  ButtonGroup,
  CheckboxGroup,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import RoleOptionCard from "components/[guild]/RoleOptionCard"
import { Check, Copy, DownloadSimple, Export } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import useGuildRoles from "./hooks/useGuildRoles"

const MembersExporter = (): JSX.Element => {
  const aRef = useRef(null)
  const label = useBreakpointValue({ base: "Export", sm: "Export members" })
  const bg = useColorModeValue("gray.50", "blackAlpha.100")

  const [selectedRoles, setSelectedRoles] = useState([])

  const { guildRoles, isGuildRolesLoading } = useGuildRoles()

  const { hasCopied, value, setValue, onCopy } = useClipboard("")
  const csvContent = encodeURI("data:text/csv;charset=utf-8," + value)

  useEffect(() => {
    setValue(
      [
        ...new Set(
          guildRoles
            ?.filter((role) => selectedRoles.includes(role.id.toString()))
            ?.map((role) => role.members)
            ?.reduce((a, b) => a.concat(b), [])
            ?.filter((member) => !!member) ?? []
        ),
      ].join("\n")
    )
  }, [selectedRoles, guildRoles])

  const exportMembersAsCsv = () => {
    if (!aRef.current) return
    aRef.current.click()
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
        <PopoverContent
          pos="relative"
          minW="350px"
          _before={{
            content: '""',
            bg,
            pos: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: "xl",
            zIndex: -1,
          }}
        >
          <PopoverArrow />
          <PopoverCloseButton rounded="full" />
          <PopoverHeader fontSize="sm" fontWeight="bold" border="none">
            Select roles to export members of
          </PopoverHeader>
          <PopoverBody>
            {isGuildRolesLoading ? (
              <Flex justifyContent="center" py={2} w="full">
                <Spinner />
              </Flex>
            ) : (
              <>
                <CheckboxGroup
                  onChange={(newList) => setSelectedRoles(newList)}
                  colorScheme="primary"
                >
                  <Stack>
                    {guildRoles?.map((role) => (
                      <RoleOptionCard key={role.id} role={role} />
                    ))}
                  </Stack>
                </CheckboxGroup>
              </>
            )}
          </PopoverBody>
          {guildRoles?.length && (
            <PopoverFooter
              borderColor="transparent"
              mt="1"
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Text
                colorScheme={"gray"}
                fontSize="sm"
                fontWeight={"semibold"}
                noOfLines={1}
                mr="2"
              >
                {`${value ? value.split("\n").length : 0} addresses`}
              </Text>
              <ButtonGroup
                size="sm"
                colorScheme="primary"
                isDisabled={!value.length}
              >
                <Button
                  rounded="md"
                  pt="1px"
                  onClick={onCopy}
                  leftIcon={hasCopied ? <Check /> : <Copy />}
                >
                  {`${hasCopied ? "Copied" : "Copy"}`}
                </Button>
                <Button
                  rounded="md"
                  pt="1px"
                  onClick={exportMembersAsCsv}
                  leftIcon={<DownloadSimple />}
                >
                  Download
                </Button>
              </ButtonGroup>

              <a
                ref={aRef}
                href={csvContent}
                download="members"
                style={{ display: "none" }}
              />
            </PopoverFooter>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default MembersExporter
