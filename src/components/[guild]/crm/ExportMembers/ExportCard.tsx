import {
  Box,
  ButtonGroup,
  Collapse,
  HStack,
  Icon,
  Tag,
  TagLeftIcon,
  Text,
  Wrap,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import {
  CaretDown,
  Check,
  Copy,
  Download,
  MagnifyingGlass,
  SortAscending,
  SortDescending,
} from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { ExportData, crmOrderByParams } from "./ExportMembersModal"

const ExportCard = ({ exp }: { exp: ExportData }) => {
  const date = new Date(exp.createdAt)
  const timeDifference = Date.now() - date.getTime()
  const since = formatRelativeTimeFromNow(timeDifference)

  const { isOpen, onToggle } = useDisclosure()

  const { id } = useGuild()
  const { data, isLoading, error } = useSWRWithOptionalAuth(
    isOpen ? `/v2/crm/guilds/${id}/exports/${exp.filename}` : null,
    null,
    false,
    true
  )
  const csvContent = encodeURI("data:text/csv;charset=utf-8," + data)

  const {
    onCopy,
    // setValue: setBackup,
    // value: backup,
    hasCopied,
  } = useClipboard(data, 4000)

  return (
    <Card>
      <Button p="4" onClick={onToggle} variant="unstyled" h="auto">
        <HStack>
          <Box>
            <HStack mb="0.5" spacing={1}>
              <Text fontWeight={"bold"} textAlign={"left"}>
                {isOpen
                  ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                  : `${since} ago`}
              </Text>
            </HStack>
            <Wrap spacing={1}>
              {exp.data.params.search && (
                <Tag>
                  <TagLeftIcon as={MagnifyingGlass} />
                  {exp.data.params.search}
                </Tag>
              )}
              {exp.data.params.roleIds.length > 0 && (
                <Tag>
                  {Array.isArray(exp.data.params.roleIds)
                    ? `${exp.data.params.roleIds.length} roles`
                    : "1 role"}
                </Tag>
              )}
              {exp.data.params.order && (
                <Tag>
                  <TagLeftIcon
                    as={
                      exp.data.params.sortOrder === "desc"
                        ? SortDescending
                        : SortAscending
                    }
                  />
                  {crmOrderByParams[exp.data.params.order]}
                </Tag>
              )}
            </Wrap>
          </Box>
          <MemberCount memberCount={exp.data.memberCount} ml="auto" mt="0" />
          <Icon
            as={CaretDown}
            aria-label="Open export"
            transform={isOpen && "rotate(180deg)"}
            transition="transform .3s"
          />
        </HStack>
      </Button>

      <Collapse in={isOpen}>
        <Box p="4">
          <ButtonGroup
            size="sm"
            mt="2"
            ml="auto"
            spacing="1"
            justifyContent={"flex-end"}
            w="full"
          >
            <Button
              as="a"
              download={exp.filename}
              href={csvContent}
              leftIcon={<Download />}
              aria-label={"Download export"}
              isLoading={isLoading}
              loadingText="Download"
              borderRadius="lg"
            >
              Download
            </Button>
            <Button
              leftIcon={hasCopied ? <Check /> : <Copy />}
              aria-label={"Download export"}
              isLoading={isLoading}
              isDisabled={hasCopied}
              loadingText="Copy addresses"
              onClick={onCopy}
              borderRadius="lg"
            >
              {hasCopied ? "Copied" : "Copy addresses"}
            </Button>
          </ButtonGroup>
        </Box>
      </Collapse>
    </Card>
  )
}

export default ExportCard
