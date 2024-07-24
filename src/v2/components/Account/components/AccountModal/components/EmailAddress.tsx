import { Error } from "@/components/Error"
import { Button, ButtonProps } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent } from "@/components/ui/Collapsible"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/InputOTP"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useToast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSimple, Warning } from "@phosphor-icons/react/dist/ssr"
import { useConnectEmail } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { ReactNode, useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { emailData } from "rewards/Email/data"
import fetcher from "utils/fetcher"
import { z } from "zod"
import { useDisconnectEmail } from "../hooks/useDisconnect"
import processEmailError from "../utils/processEmailError"
import { DisconnectAccountButton } from "./DisconnectAccountButton"
import { SocialAccountUI } from "./SocialAccount"

const PIN_LENGTH = 6
const TIMEOUT = 10_000
const emailFormSchema = z.object({
  email: z.string().email("Invalid E-mail address"),
  code: z
    .string()
    .refine((value) => (!!value ? value.length === PIN_LENGTH : true), {
      message: "Invalid code",
    })
    .optional(),
})

const TOO_MANY_ATTEMPTS_ERROR =
  "The code has been invalidated due to too many attempts"

const EmailAddress = () => {
  const { emails } = useUser()
  const isConnected = !!emails?.emailAddress && !emails.pending

  return (
    <SocialAccountUI
      type={"EMAIL"}
      username={emails?.emailAddress}
      isConnected={isConnected}
    >
      {isConnected ? <DisconnectEmailButton /> : <ConnectEmailButton />}
    </SocialAccountUI>
  )
}

const ConnectEmailButton = ({
  onSuccess,
  isReconnection: _,
  leftIcon,
  className,
  ...props
}: ButtonProps & {
  onSuccess?: () => void
  isReconnection?: boolean
  leftIcon?: ReactNode // TODO: we should find a different solution
}) => {
  const { emails } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pendingEmailAddress, setPendingEmailAddress] = useState(
    emails?.pending ? emails?.emailAddress : null
  )

  const methods = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "", code: "" },
  })

  const { handleSubmit, control, setValue, setError, reset } = methods
  const email = useWatch({ control, name: "email" })
  const { id: userId } = useUser()
  const { toast } = useToast()

  const [emailSentAt, setEmailSentAt] = useState<number | null>(null)

  const submitVerificationRequest = (
    signedPayload: SignedValidation
  ): Promise<{ remainingAttempts: number; success: boolean }> =>
    fetcher(`/v2/users/${userId}/emails`, signedPayload).then((data) => {
      setEmailSentAt(Date.now())
      return data
    })

  const verificationRequest = useSubmitWithSign(submitVerificationRequest)

  const shouldShowPinEntry = !!verificationRequest.response || !!pendingEmailAddress

  const handleOnClose = () => {
    verificationRequest.reset()
    reset()
    if (emails?.emailAddress) {
      setPendingEmailAddress(emails.emailAddress)
      setValue("email", emails.emailAddress)
    }
    onClose()
  }

  const submit = handleSubmit((formValues) =>
    verificationRequest.onSubmit({ emailAddress: formValues.email })
  )

  const differentEmail = () => {
    setPendingEmailAddress(null)
    setValue("code", "")
    setValue("email", "")
    connect.reset()
    verificationRequest.reset()
  }

  const connect = useConnectEmail({
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      } else {
        toast({ variant: "success", title: "Email verified" })
      }
      handleOnClose()
    },
    onError: (error) => {
      if (error?.error?.includes(TOO_MANY_ATTEMPTS_ERROR)) {
        differentEmail()
        return
      }
      setError("code", {
        type: "validate",
        message: "Invalid code",
      })
      setValue("code", "")
    },
  })

  // Set the known pending email address
  useEffect(() => {
    if (!emails?.pending) return
    setPendingEmailAddress(emails?.emailAddress)
    setValue("email", emails?.emailAddress)
  }, [emails, setValue])

  // Timer to decide if resend button is disabled
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = !emailSentAt || dateNow - emailSentAt > TIMEOUT
  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])
  const isResendButtonDisabled = shouldShowPinEntry && !canResend && !connect.error

  return (
    <>
      <Dialog open={isOpen}>
        <FormProvider {...methods}>
          <DialogContent
            size="sm"
            onEscapeKeyDown={handleOnClose}
            onPointerDownOutside={handleOnClose}
          >
            <DialogHeader>
              <DialogTitle>Connect email</DialogTitle>
            </DialogHeader>
            <DialogCloseButton onClick={handleOnClose} />

            <DialogBody>
              <Error
                error={verificationRequest.error ?? connect.error}
                processError={processEmailError}
              />

              <Collapsible open={!shouldShowPinEntry}>
                <CollapsibleContent className="p-[2px]">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="me@example.com" autoFocus />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={shouldShowPinEntry}>
                <CollapsibleContent className="p-[2px]">
                  <div className="flex w-full flex-col items-center gap-4">
                    <p className="text-center">
                      {`Enter the code we've sent to ${email} `}
                      <Button
                        variant="ghost"
                        className="relative top-0.5 size-5 rounded-full"
                        size="icon"
                        aria-label="Use different email address"
                        onClick={differentEmail}
                      >
                        <PencilSimple weight="bold" />
                      </Button>
                    </p>

                    <FormField
                      control={control}
                      name="code"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <InputOTP
                              maxLength={PIN_LENGTH}
                              {...field}
                              onChange={(value) => {
                                onChange(value)
                                if (value.length === PIN_LENGTH) {
                                  connect.onSubmit({
                                    authData: { code: value },
                                    emailAddress: email,
                                  })
                                }
                              }}
                              autoFocus
                            >
                              <InputOTPGroup>
                                {[...Array(PIN_LENGTH)].map((_, i) => (
                                  <InputOTPSlot key={`input-otp-${i}`} index={i} />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormErrorMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </DialogBody>

            <DialogFooter className="pt-2">
              {shouldShowPinEntry ? (
                <Tooltip open={!isResendButtonDisabled ? false : undefined}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={submit}
                      isLoading={
                        verificationRequest.isLoading ||
                        connect.isLoading ||
                        connect.isSigning
                      }
                      variant="ghost"
                      size="sm"
                      disabled={isResendButtonDisabled}
                      className="w-full rounded-lg"
                    >
                      Resend code
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Check if you received the first code before requesting a new
                      one (check in the spam as well)
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  onClick={submit}
                  isLoading={verificationRequest.isLoading}
                  colorScheme="success"
                  className="w-full"
                >
                  Send code
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </FormProvider>
      </Dialog>

      <Button
        onClick={onOpen}
        colorScheme={emails?.pending ? "secondary" : "primary"}
        size="sm"
        disabled={!!emails?.emailAddress && !emails?.pending}
        className={cn(
          "ml-auto",
          {
            "bg-email hover:bg-email-hover active:bg-email-active": !emails?.pending,
          },
          className
        )}
        {...props}
      >
        {emails?.pending ? (
          <>
            {/* TODO: maybe move this out to a CSS variable? */}
            <Warning
              weight="bold"
              className="mr-1 text-orange-400 dark:text-orange-200"
            />
            Verify
          </>
        ) : (
          <>
            {leftIcon}
            {emails?.emailAddress || "Connect"}
          </>
        )}
      </Button>
    </>
  )
}

const DisconnectEmailButton = () => {
  const disclosure = useDisclosure()
  const { emails } = useUser()

  const { onSubmit, isLoading, signLoadingText } = useDisconnectEmail(
    disclosure.onClose
  )
  const onConfirm = () => onSubmit(emails?.emailAddress)
  const loadingText = signLoadingText ?? "Removing"

  return (
    <DisconnectAccountButton
      name={emailData.name}
      className="ml-auto"
      {...{ state: disclosure, isLoading, loadingText, onConfirm }}
    />
  )
}

export { ConnectEmailButton }
export default EmailAddress
