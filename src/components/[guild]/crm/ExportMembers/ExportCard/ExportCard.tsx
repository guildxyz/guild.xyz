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
  Tooltip,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { CaretDown, Check, Copy, Download } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ErrorAlert from "components/common/ErrorAlert"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { ExportData } from "../useExports"
import ExportParamsTags from "./ExportParamsTags"

const ExportCard = ({ exp }: { exp: ExportData }) => {
  const date = new Date(exp.createdAt)
  const timeDifference = Date.now() - date.getTime()
  const since = formatRelativeTimeFromNow(timeDifference)

  const { isOpen, onToggle } = useDisclosure()

  return (
    <CardMotionWrapper>
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
              <ExportParamsTags {...exp.data.params} />
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
              <Tooltip
                label="It may take some time to export a lot of members. Feel free to leave the site and come back later!"
                hasArrow
              >
                <Tag colorScheme="blue">
                  <TagLeftIcon as={Spinner} />
                  Creating
                </Tag>
              </Tooltip>
            )}
          </HStack>
        </Button>
        <Collapse in={isOpen} unmountOnExit>
          <ExportControls filename={exp.filename} />
        </Collapse>
      </Card>
    </CardMotionWrapper>
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

  const { onCopy, hasCopied } = useClipboard(data, 4000)
  const csvContent = encodeURI("data:text/csv;charset=utf-8," + data)

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
          leftIcon={hasCopied ? <Check /> : <Copy />}
          aria-label={"Download export"}
          variant="outline"
          isLoading={isLoading}
          isDisabled={hasCopied || error}
          loadingText="Copy addresses"
          onClick={onCopy}
          borderRadius="lg"
        >
          {hasCopied ? "Copied" : "Copy addresses"}
        </Button>
        <Button
          as="a"
          download={filename}
          href={csvContent}
          leftIcon={<Download />}
          aria-label={"Download export"}
          colorScheme="blue"
          isLoading={isLoading}
          isDisabled={error}
          loadingText="Download"
          borderRadius="lg"
        >
          Download
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default ExportCard
