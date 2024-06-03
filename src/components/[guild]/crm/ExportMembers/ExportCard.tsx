import {
  Box,
  ButtonGroup,
  Collapse,
  HStack,
  Icon,
  Spinner,
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
import ErrorAlert from "components/common/ErrorAlert"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { ExportData, crmOrderByParams } from "./ExportMembersModal"

const ExportCard = ({ exp }: { exp: ExportData }) => {
  const date = new Date(exp.createdAt)
  const timeDifference = Date.now() - date.getTime()
  const since = formatRelativeTimeFromNow(timeDifference)

  const { isOpen, onToggle } = useDisclosure()

  return (
    <Card>
      <Button
        p="4"
        variant="unstyled"
        h="auto"
        onClick={exp.status === "FINISHED" ? onToggle : null}
        cursor={exp.status === "FINISHED" ? "pointer" : "default"}
      >
        <HStack>
          <Box mr="auto">
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
          {exp.status === "FINISHED" ? (
            <>
              <MemberCount memberCount={exp.data.count} mt="0" />
              <Icon
                as={CaretDown}
                aria-label="Open export"
                transform={isOpen && "rotate(180deg)"}
                transition="transform .3s"
              />
            </>
          ) : exp.status === "FAILED" ? (
            <Tag colorScheme="red">Failed</Tag>
          ) : (
            <Tag colorScheme="blue">
              <TagLeftIcon as={Spinner} />
              Creating
            </Tag>
          )}
        </HStack>
      </Button>

      <Collapse in={isOpen} unmountOnExit>
        <ExportControls filename={exp.filename} />
      </Collapse>
    </Card>
  )
}

const ExportControls = ({ filename }) => {
  const { id } = useGuild()
  const { data, isLoading, error } = useSWRWithOptionalAuth(
    `/v2/crm/guilds/${id}/exports/${filename}`,
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
    <Box p="4">
      {error && <ErrorAlert label="Couldn't fetch export" />}
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
          download={filename}
          href={csvContent}
          leftIcon={<Download />}
          aria-label={"Download export"}
          isLoading={isLoading}
          isDisabled={error}
          loadingText="Download"
          borderRadius="lg"
        >
          Download
        </Button>
        <Button
          leftIcon={hasCopied ? <Check /> : <Copy />}
          aria-label={"Download export"}
          isLoading={isLoading}
          isDisabled={hasCopied || error}
          loadingText="Copy addresses"
          onClick={onCopy}
          borderRadius="lg"
        >
          {hasCopied ? "Copied" : "Copy addresses"}
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default ExportCard
