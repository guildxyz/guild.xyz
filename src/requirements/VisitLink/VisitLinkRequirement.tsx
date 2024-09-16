import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { ArrowSquareOut, Link as LinkIcon } from "@phosphor-icons/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import {
  RequirementImage,
  RequirementImageCircle,
} from "components/[guild]/Requirements/components/RequirementImage"
import ResetRequirementButton, {
  getDefaultVisitLinkCustomName,
} from "components/[guild]/Requirements/components/ResetRequirementButton"
import ViewOriginalPopover from "components/[guild]/Requirements/components/ViewOriginalPopover"
import useUser from "components/[guild]/hooks/useUser"
import { Alert } from "components/common/Modal"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import NextLink from "next/link"
import { useRef } from "react"
import { useFormContext } from "react-hook-form"
import fetcher from "utils/fetcher"

export const VISIT_LINK_REGEX = new RegExp(/^(.*)(\[)(.+?)(\])(.*)$/)

const visitLink = (signedValidation: SignedValidation) =>
  fetcher("/v2/util/gate-callbacks?requirementType=LINK_VISIT", {
    ...signedValidation,
    method: "POST",
  })

const VisitLinkRequirement = ({ ...props }: RequirementProps) => {
  const formContext = useFormContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { id: requirementId, data, roleId } = useRequirementContext()
  const { id: userId } = useUser()

  const { triggerMembershipUpdate } = useMembershipUpdate()
  const { reqAccesses } = useRoleMembership(roleId)
  const hasAccess = reqAccesses?.find(
    (req) => req.requirementId === requirementId
  )?.access

  const showErrorToast = useShowErrorToast()
  const { onSubmit } = useSubmitWithSign(visitLink, {
    onSuccess: () => triggerMembershipUpdate({ roleIds: [roleId] }),
    onError: () => showErrorToast("Something went wrong"),
  })

  const isCustomName = data?.customName !== getDefaultVisitLinkCustomName(data)
  const [, first, , link, , second] = isCustomName
    ? (VISIT_LINK_REGEX.exec(data.customName) ?? [])
    : []

  const onVisit = () => {
    if (!userId || hasAccess) return

    onSubmit({
      requirementId,
      id: data.id,
      userId,
    })
  }

  const Original = () => {
    const wordBreak = data.id?.startsWith("http") ? "break-all" : "break-word"

    return (
      <>
        {"Visit link: "}
        <Link
          href={data.id}
          isExternal
          colorScheme="blue"
          wordBreak={wordBreak}
          onClick={onVisit}
        >
          {data.id}
        </Link>
      </>
    )
  }

  return (
    <Requirement
      image={<Icon as={LinkIcon} boxSize={6} />}
      {...props}
      showViewOriginal={false}
      footer={
        (isCustomName || !!data?.customImage) && (
          <ViewOriginalPopover>
            <HStack p={3} gap={4}>
              <RequirementImageCircle>
                <RequirementImage image={<Icon as={LinkIcon} boxSize={6} />} />
              </RequirementImageCircle>
              <Stack
                direction={{ base: "column", md: "row" }}
                alignItems={{ base: "flex-start", md: "center" }}
                spacing={{ base: 2, md: 5 }}
              >
                <Text wordBreak="break-word" flexGrow={1}>
                  <Original />
                </Text>
                {/* We only need to show it in the edit drawer, hence the formContext check */}
                {!!formContext && <ResetRequirementButton />}
              </Stack>
            </HStack>
          </ViewOriginalPopover>
        )
      }
    >
      {isCustomName ? (
        <Text as="span">
          {first}
          <Button
            variant="link"
            fontWeight="medium"
            colorScheme="blue"
            wordBreak="break-all"
            whiteSpace="normal"
            textAlign="start"
            onClick={onOpen}
          >
            {link}
          </Button>

          {second}
        </Text>
      ) : (
        <Original />
      )}

      <LeaveGuildToExternalLinkAlert
        {...{ isOpen, onClose, onVisit }}
        url={data.id}
      />
    </Requirement>
  )
}

const LeaveGuildToExternalLinkAlert = ({ isOpen, onClose, onVisit, url }) => {
  const cancelRef = useRef(null)
  const bg = useColorModeValue("gray.50", "blackAlpha.50")

  const urlObj = new URL(url)
  const urlArray = url.split(urlObj.hostname)

  return (
    <Alert {...{ isOpen, onClose }} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Leaving Guild</AlertDialogHeader>
        <AlertDialogBody pt="0">
          <Text mb="4">
            This link is taking you to the following website. Please confirm it's
            safe before continuing!
          </Text>
          <Box p="4" borderRadius="xl" borderWidth="1px" bg={bg}>
            <Text fontWeight={"medium"}>
              <Text as="span" colorScheme="gray">
                {urlArray[0]}
              </Text>
              <Text as="span">{urlObj.hostname}</Text>
              <Text as="span" colorScheme="gray">
                {urlArray[1]}
              </Text>
            </Text>
          </Box>
        </AlertDialogBody>
        <AlertDialogFooter display={"flex"} gap={2}>
          <Button ref={cancelRef} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            as={NextLink}
            href={url}
            target="_blank"
            onClick={() => {
              onVisit()
              onClose()
            }}
            colorScheme="indigo"
            rightIcon={<ArrowSquareOut />}
          >
            Visit Site
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Alert>
  )
}

export default VisitLinkRequirement
