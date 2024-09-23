import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { anchorVariants } from "@/components/ui/Anchor"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent } from "@/components/ui/Collapsible"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { cn } from "@/lib/utils"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import useGuild from "components/[guild]/hooks/useGuild"
import { useAtomValue } from "jotai"
import dynamic from "next/dynamic"
import { ComponentType, Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import rewards from "rewards"
import { ConnectPlatform } from "./components/ConnectPlatform"
import { ShareSocialsCheckbox } from "./components/ShareSocialsCheckbox"
import { WalletAuthButton } from "./components/WalletAuthButton"
import { GetRewardsJoinStep } from "./components/progress/GetRewardsJoinStep"
import { GetRolesJoinStep } from "./components/progress/GetRolesJoinStep"
import { SatisfyRequirementsJoinStep } from "./components/progress/SatisfyRequirementsJoinStep"
import { useJoin } from "./hooks/useJoin"
import { JoinForm, Joinable } from "./types"

const customJoinStep: Partial<Record<Joinable, ComponentType<unknown>>> = {
  CAPTCHA: dynamic(() => import("./components/CompleteCaptchaJoinStep")),
  EMAIL: dynamic(() => import("./components/ConnectEmailJoinStep")),
}

const JoinModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const isWalletSelectorModalOpen = useAtomValue(walletSelectorModalAtom)
  const { name, requiredPlatforms, featureFlags } = useGuild()

  const methods = useForm<JoinForm>({
    mode: "all",
    defaultValues: {
      shareSocials: featureFlags?.includes("CRM") ? true : undefined,
    },
  })
  const { handleSubmit } = methods

  const renderedSteps = (requiredPlatforms ?? []).map((platform, index) => {
    const shouldRenderSeparator = index < (requiredPlatforms?.length ?? 0) - 1

    if (platform in customJoinStep) {
      const ConnectComponent = customJoinStep[platform]
      if (!ConnectComponent) return null
      return (
        <Fragment key={platform}>
          <ConnectComponent />
          {shouldRenderSeparator && <Separator />}
        </Fragment>
      )
    }

    if (!rewards[platform]?.isPlatform) return null

    return (
      <Fragment key={platform}>
        <ConnectPlatform platform={platform} />
        {shouldRenderSeparator && <Separator />}
      </Fragment>
    )
  })

  const errorToast = useErrorToast()

  const { isLoading, onSubmit, joinProgress, reset } = useJoin({
    onSuccess: () => onClose(),
    onError: (err) => {
      errorToast(err)
      reset()
    },
  })

  const onJoin = (data: JoinForm) => {
    onSubmit({
      shareSocials: data?.shareSocials,
    })
  }

  const isInDetailedProgressState = !!joinProgress
    ? joinProgress?.state === "MANAGING_ROLES" ||
      joinProgress?.state === "MANAGING_REWARDS" ||
      joinProgress?.state === "FINISHED"
    : false

  const hasNoAccess = !!joinProgress && joinProgress.state === "NO_ACCESS"

  const { roles } = useGuild()

  const onClick = () => {
    onClose()
    window.location.hash = `role-${roles?.[0]?.id}`
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newIsOpen) => (!newIsOpen ? onClose() : {})}
    >
      <DialogContent trapFocus={!isWalletSelectorModalOpen}>
        <DialogHeader>
          <DialogTitle>{`Join ${name}`}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FormProvider {...methods}>
            <Collapsible open={!isInDetailedProgressState}>
              <CollapsibleContent>
                <div className="mb-3 flex w-full flex-col items-stretch gap-3">
                  <WalletAuthButton />
                  {renderedSteps?.length > 0 && <Separator />}
                  {renderedSteps}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Wrapper div to apply the margin when the collapse is `display: none` too */}
            <div
              className={cn("mb-8", {
                "mb-2.5": isInDetailedProgressState,
              })}
            >
              <Collapsible open={isLoading || hasNoAccess}>
                <CollapsibleContent>
                  {!isInDetailedProgressState && <Separator className="mb-3" />}
                  <SatisfyRequirementsJoinStep
                    joinState={joinProgress}
                    fallbackText={
                      hasNoAccess && (
                        <p>
                          {`You're not eligible with your connected accounts. `}
                          <Button
                            variant="unstyled"
                            className={anchorVariants({
                              variant: "muted",
                              className: "h-auto p-0",
                            })}
                            rightIcon={<ArrowRight weight="bold" />}
                            onClick={onClick}
                          >
                            See requirements
                          </Button>
                        </p>
                      )
                    }
                    className="gap-2.5"
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>

            {isInDetailedProgressState && <Separator className="mb-2.5" />}

            <Collapsible open={isInDetailedProgressState}>
              <CollapsibleContent>
                <div className="mb-6 flex w-full flex-col items-stretch gap-2.5">
                  <GetRolesJoinStep joinState={joinProgress} />
                  <Separator />
                  <GetRewardsJoinStep joinState={joinProgress} />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={!(isLoading || hasNoAccess)}>
              <CollapsibleContent>
                {featureFlags?.includes("CRM") && <ShareSocialsCheckbox />}
              </CollapsibleContent>
            </Collapsible>

            <Button
              colorScheme={hasNoAccess ? "secondary" : "success"}
              variant={hasNoAccess ? "outline" : "solid"}
              size={hasNoAccess ? "md" : "lg"}
              onClick={handleSubmit(onJoin)}
              isLoading={isLoading}
              loadingText={
                !!joinProgress && joinProgress.state === "FINISHED"
                  ? "Finalizing results"
                  : !!joinProgress
                    ? "See status above"
                    : "Checking access"
              }
              disabled={!isWeb3Connected}
              className="mt-2"
            >
              {hasNoAccess ? "Recheck access" : "Check access to join"}
            </Button>
          </FormProvider>
        </DialogBody>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export { JoinModal }
