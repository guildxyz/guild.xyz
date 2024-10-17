import { Alert, AlertTitle } from "@/components/ui/Alert"
import { Button, ButtonProps } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { CircleNotch, Robot, WarningCircle } from "@phosphor-icons/react/dist/ssr"
import { useMembershipUpdate } from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import { DataBlock } from "components/common/DataBlock"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { Dispatch, ReactNode, SetStateAction } from "react"
import useSWRImmutable from "swr/immutable"
import useVerifyCaptcha from "../hooks/useVerifyCaptcha"

const CompleteCaptcha = ({ className, ...props }: ButtonProps): ReactNode => {
  const { id: userId } = useUser()
  const { id, roleId } = useRequirementContext()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { reqAccesses } = useRoleMembership(roleId)

  const reqAccess = reqAccesses?.find((err) => err.requirementId === id)

  const { isOpen, onOpen, setValue } = useDisclosure()

  if (!userId || (!!reqAccess?.access && !reqAccess?.errorType)) return null

  return (
    <>
      <Button
        size="xs"
        leftIcon={<Robot weight="bold" />}
        // TODO: extract it to a constant, just like we did with PLATFORM_COLORS
        className={cn(
          "bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700 active:dark:bg-cyan-300 hover:dark:bg-cyan-400",
          className
        )}
        onClick={() => onOpen()}
        {...props}
      >
        Complete CAPTCHA
      </Button>

      <CompleteCaptchaDialog
        open={isOpen}
        onOpenChange={setValue}
        onComplete={() => triggerMembershipUpdate({ roleIds: [roleId] })}
      />
    </>
  )
}

type CompleteCaptchaDialogProps = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  onComplete?: () => void
}

const CompleteCaptchaDialog = ({
  open,
  onOpenChange,
  onComplete,
}: CompleteCaptchaDialogProps) => {
  const fetcherWithSign = useFetcherWithSign()
  const {
    data: getGateCallbackData,
    isValidating,
    error: getGateCallbackError,
  } = useSWRImmutable(
    open
      ? [`/v2/util/gate-callbacks/session?requirementType=CAPTCHA`, { body: {} }]
      : null,
    fetcherWithSign
  )

  const { onSubmit, isLoading } = useVerifyCaptcha(() => {
    onComplete?.()
    onOpenChange(false)
  })

  const onVerify = (token: string) =>
    onSubmit({
      callback: getGateCallbackData?.callbackUrl,
      token,
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete CAPTCHA</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {getGateCallbackError ? (
            <Alert variant="error" className="mb-6">
              <WarningCircle weight="fill" className="size-6" />
              <AlertTitle>Couldn't generate CAPTCHA</AlertTitle>
            </Alert>
          ) : (!getGateCallbackData?.callbackUrl && isValidating) || isLoading ? (
            <>
              <CircleNotch weight="bold" className="mx-auto size-8 animate-spin" />
              <p className="mt-4 mb-6 text-center">
                {`${isLoading ? "Verifying" : "Generating"} CAPTCHA`}
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto">
                {typeof window !== "undefined" &&
                window.location.hostname === "localhost" ? (
                  <p>
                    <span>{"HCaptcha doesn't work on localhost. Please use "}</span>
                    <DataBlock>127.0.0.1</DataBlock>
                    <span>{" instead."}</span>
                  </p>
                ) : (
                  <HCaptcha
                    sitekey="05bdce9d-3de2-4457-8318-85633ffd281c"
                    onVerify={onVerify}
                  />
                )}
              </div>
              {typeof window !== "undefined" &&
                window.location.hostname !== "localhost" && (
                  <p className="mt-6 text-center">
                    Please complete the CAPTCHA above! The modal will automatically
                    close on success
                  </p>
                )}
            </>
          )}
        </DialogBody>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export default CompleteCaptcha
export { CompleteCaptchaDialog }
