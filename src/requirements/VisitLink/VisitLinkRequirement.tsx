import {
  Link as ChakraLink,
  ChakraProps,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
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
import useIsMember from "components/[guild]/hooks/useIsMember"
import useUser from "components/[guild]/hooks/useUser"
import Link from "components/common/Link"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { Link as LinkIcon } from "phosphor-react"
import { ComponentProps } from "react"
import fetcher from "utils/fetcher"

export const VISIT_LINK_REGEX = new RegExp(/^(.*)(\[)(.+?)(\])(.*)$/)

const visitLink = (signedValidation: SignedValidation) =>
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
    .find((req) => req.requirementId === requirementId)?.access

  const isMember = useIsMember()
  const openJoinModal = useOpenJoinModal()

  const showErrorToast = useShowErrorToast()
  const { onSubmit } = useSubmitWithSign(visitLink, {
    onSuccess: () => mutateAccess(),
    onError: () => showErrorToast("Something went wrong"),
  })

  const [, first, , link, , second] = !!data.customName
    ? VISIT_LINK_REGEX.exec(data.customName) ?? []
    : []

  const chakraLinkprops: Pick<
    ComponentProps<typeof ChakraLink>,
    "colorScheme" | "onClick"
  > &
    ChakraProps = {
    display: "inline",
    colorScheme: "blue",
    onClick: () => openJoinModal(),
  }

  const linkProps: ComponentProps<typeof Link> = {
    href: data.id,
    isExternal: true,
    onClick: () => {
      if (!userId || hasAccess) return

      onSubmit({
        requirementId,
        id: data.id,
        userId,
      })
    },
  }

  const Original = () => {
    const wordBreak = data.id?.startsWith("http") ? "break-all" : "break-word"

    return (
      <>
        {"Visit link: "}
        {isMember || hasAccess ? (
          <Link {...chakraLinkprops} {...linkProps} wordBreak={wordBreak}>
            {data.id}
          </Link>
        ) : (
          <ChakraLink {...chakraLinkprops} wordBreak={wordBreak}>
            {data.id}
          </ChakraLink>
        )}
      </>
    )
  }

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
          {isMember || hasAccess ? (
            <Link {...chakraLinkprops} {...linkProps}>
              {link}
            </Link>
          ) : (
            <ChakraLink {...chakraLinkprops}>{link}</ChakraLink>
          )}
          {second}
        </Text>
      ) : (
        <Original />
      )}
    </Requirement>
  )
}

export default VisitLinkRequirement
