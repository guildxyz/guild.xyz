import {
  Box,
  IconButton,
  Spinner,
  Tag,
  TagLeftIcon,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Download } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import useGuild from "components/[guild]/hooks/useGuild"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { atom, useAtom } from "jotai"
import fetcher from "utils/fetcher"
import { ExportData } from "../useExports"
import ExportParamsTags from "./ExportParamsTags"

const absoluteTimeAtom = atom(false)

const ExportCard = ({ exp }: { exp: ExportData }) => {
  const date = new Date(exp.createdAt)
  const timeDifference = Date.now() - date.getTime()
  const since = formatRelativeTimeFromNow(timeDifference)
  const [isAbsoluteTime, setIsAbsoluteTime] = useAtom(absoluteTimeAtom)
  const toggleAbsoluteTime = () => setIsAbsoluteTime((prev) => !prev)

  return (
    <CardMotionWrapper>
      <Card p="4" alignItems="center" flexDir="row">
        <Box mr="auto">
          <Tooltip
            label={isAbsoluteTime ? "Show relative time" : "Show timestamp"}
            hasArrow
          >
            <Text
              fontWeight={"bold"}
              textAlign={"left"}
              onClick={toggleAbsoluteTime}
              cursor="pointer"
              mb="1"
            >
              {isAbsoluteTime
                ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                : `${since} ago`}
            </Text>
          </Tooltip>
          <ExportParamsTags {...exp.data.params} />
        </Box>
        {exp.status === "FINISHED" ? (
          <>
            <MemberCount memberCount={exp.data.count} mt="0" mr="0.5" size="sm" />
            <DownloadExportButton filename={exp.filename} />
          </>
        ) : exp.status === "FAILED" ? (
          <Tag colorScheme="red">Failed</Tag>
        ) : (
          <Tag colorScheme="blue">
            <TagLeftIcon as={Spinner} />
            Creating
          </Tag>
        )}
      </Card>
    </CardMotionWrapper>
  )
}

const DownloadExportButton = ({ filename }) => {
  const { id } = useGuild()
  const showErrorToast = useShowErrorToast()

  const fetchExport = (signedValidation) =>
    fetcher(`/v2/crm/guilds/${id}/exports/${filename}`, {
      method: "GET",
      ...signedValidation,
    })

  const { onSubmit, isLoading } = useSubmitWithSign(fetchExport, {
    onSuccess: (res) =>
      downloadFile(encodeURI(`data:text/csv;charset=utf-8,${res}`), filename),
    onError: (err) => showErrorToast(err),
  })

  return (
    <Tooltip
      label={isLoading ? "Download starting..." : "Download export"}
      shouldWrapChildren
      hasArrow
    >
      <IconButton
        variant="ghost"
        colorScheme="blue"
        h="10"
        icon={<Download />}
        onClick={() => onSubmit()}
        aria-label={"Download export"}
        isLoading={isLoading}
      />
    </Tooltip>
  )
}

const downloadFile = (url, filename) =>
  Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  }).click()

export default ExportCard
