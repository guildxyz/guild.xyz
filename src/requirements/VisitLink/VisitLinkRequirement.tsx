import { HStack, Icon, Stack, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import {
  RequirementImage,
  RequirementImageCircle,
} from "components/[guild]/Requirements/components/RequirementImage"
import ResetRequirementButton from "components/[guild]/Requirements/components/ResetRequirementButton"
import ViewOriginalPopover from "components/[guild]/Requirements/components/ViewOriginalPopover"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import Link from "components/common/Link"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { Link as LinkIcon } from "phosphor-react"
import { ComponentProps } from "react"
import fetcher from "utils/fetcher"

export const VISIT_LINK_REGEX = new RegExp(/^(.*)(\[)(.+?)(\])(.*)$/)

const visitLink = (signedValidation: SignedValdation) =>
  fetcher("/v2/util/gate-callbacks?requirementType=LINK_VISIT", {
    ...signedValidation,
    method: "POST",
  })

const VisitLinkRequirement = ({ ...props }: RequirementProps) => {
  const { id: requirementId, data } = useRequirementContext()
  const { id: userId } = useUser()

  const { data: accesses, mutate: mutateAccess } = useAccess()
  const hasAccess = accesses
    ?.flatMap((role) => role.requirements)
    .find((req) => req.requirementId === requirementId).access

  const showErrorToast = useShowErrorToast()

  const { onSubmit } = useSubmitWithSign(visitLink, {
    onSuccess: () => mutateAccess(),
    onError: () => showErrorToast("Something went wrong"),
  })

  const [, first, , link, , second] = !!data.customName
    ? VISIT_LINK_REGEX.exec(data.customName) ?? []
    : []

  const linkProps: ComponentProps<typeof Link> = {
    href: data.id,
    isExternal: true,
    colorScheme: "blue",
    onClick: () => {
      if (!userId || hasAccess) return
      onSubmit({
        requirementId,
        id: data.id,
        userId,
      })
    },
  }

  const Original = () => (
    <>
      {"Visit link: "}
      <Link {...linkProps}>{data.id}</Link>
    </>
  )

  return (
    <Requirement
      image={<Icon as={LinkIcon} boxSize={6} />}
      {...props}
      showViewOriginal={false}
      footer={
        !!link && (
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
                {!!props.fieldRoot && <ResetRequirementButton />}
              </Stack>
            </HStack>
          </ViewOriginalPopover>
        )
      }
    >
      {!!link ? (
        <Text as="span">
          {first}
          <Link {...linkProps}>{link}</Link>
          {second}
        </Text>
      ) : (
        <Original />
      )}
    </Requirement>
  )
}

export default VisitLinkRequirement
