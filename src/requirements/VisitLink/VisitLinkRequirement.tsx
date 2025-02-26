import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { cn } from "@/lib/utils"
import { ArrowSquareOut, Link } from "@phosphor-icons/react/dist/ssr"
import { useMembershipUpdate } from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import {
  RequirementImage,
  RequirementImageCircle,
} from "components/[guild]/Requirements/components/RequirementImage"
import {
  ResetRequirementButton,
  getDefaultVisitLinkCustomName,
} from "components/[guild]/Requirements/components/ResetRequirementButton"
import { ViewOriginalPopover } from "components/[guild]/Requirements/components/ViewOriginalPopover"
import useUser from "components/[guild]/hooks/useUser"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { ReactNode } from "react"
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

  const { id: requirementId, data, roleId } = useRequirementContext()
  const { id: userId } = useUser()

  const { triggerMembershipUpdate } = useMembershipUpdate()
  const { reqAccesses } = useRoleMembership(roleId)
  const hasAccess = reqAccesses?.find(
    (req) => req.requirementId === requirementId
  )?.access

  const errorToast = useErrorToast()
  const { onSubmit } = useSubmitWithSign(visitLink, {
    onSuccess: () => triggerMembershipUpdate({ roleIds: [roleId] }),
    onError: () => errorToast("Something went wrong"),
  })

  const isCustomName =
    !!data?.customName && data.customName !== getDefaultVisitLinkCustomName(data)
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

  const Original = () => (
    <>
      <span>{"Visit link: "}</span>
      <Anchor
        href={data.id}
        variant="highlighted"
        showExternal
        target="_blank"
        onClick={onVisit}
        className={cn("break-words", {
          "break-all": data.id?.startsWith("http"),
        })}
      >
        {data.id}
      </Anchor>
    </>
  )

  return (
    <Requirement
      image={<Link weight="bold" className="size-6" />}
      {...props}
      showViewOriginal={false}
      footer={
        (isCustomName || !!data?.customImage) && (
          <ViewOriginalPopover>
            <div className="flex items-center gap-4">
              <RequirementImageCircle>
                <RequirementImage
                  image={<Link weight="bold" className="size-6" />}
                />
              </RequirementImageCircle>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                <p className="break-words">
                  <Original />
                </p>
                {/* We only need to show it in the edit drawer, hence the formContext check */}
                {!!formContext && <ResetRequirementButton />}
              </div>
            </div>
          </ViewOriginalPopover>
        )
      }
    >
      {isCustomName ? (
        <>
          <span>{first}</span>
          <LeaveGuildToExternalLinkAlert
            trigger={
              <Button
                variant="unstyled"
                className="h-auto break-words p-0 text-anchor-foreground underline-offset-2 hover:underline"
              >
                {link}
              </Button>
            }
            url={data.id}
            onVisit={onVisit}
          />
          <span>{second}</span>
        </>
      ) : (
        <Original />
      )}
    </Requirement>
  )
}

const LeaveGuildToExternalLinkAlert = ({
  trigger,
  onVisit,
  url,
}: {
  trigger: ReactNode
  onVisit: () => void
  url: string
}) => {
  const urlObj = new URL(url)
  const urlArray = url.split(urlObj.hostname)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leaving Guild</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogBody className="gap-4">
          <p>
            This link is taking you to the following website. Please confirm it's
            safe before continuing!
          </p>

          <div className="rounded-xl border border-border bg-blackAlpha-soft p-4">
            <p className="font-medium break-all">
              <span className="text-muted-foreground">{urlArray[0]}</span>
              <span>{urlObj.hostname}</span>
              <span className="text-muted-foreground">{urlArray[1]}</span>
            </p>
          </div>
        </AlertDialogBody>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <a
              href={url}
              target="_blank"
              onClick={() => onVisit()}
              className={buttonVariants({ colorScheme: "primary" })}
            >
              <span>Visit Site</span>
              <ArrowSquareOut weight="bold" />
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default VisitLinkRequirement
