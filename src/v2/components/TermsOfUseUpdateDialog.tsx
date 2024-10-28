"use client"

import { useDisclosure } from "@/hooks/useDisclosure"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import fetcher from "utils/fetcher"
import { Anchor } from "./ui/Anchor"
import { Button } from "./ui/Button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog"

const TermsOfUseUpdateDialog = () => {
  const { id, tosAccepted, mutate } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const pathname = usePathname()

  useEffect(() => {
    if (!id || pathname?.includes("terms-of-use")) return
    if (!tosAccepted && !isOpen) onOpen()
  }, [id, pathname, tosAccepted, isOpen, onOpen])

  const { onSubmit, isLoading } = useSubmitWithSign(
    (signedValidation: SignedValidation) =>
      fetcher(`/v2/users/${id}`, {
        ...signedValidation,
        method: "PUT",
      }),
    {
      onSuccess: () => {
        mutate(
          (prevUser) =>
            prevUser
              ? { ...prevUser, tosAccepted: new Date().toISOString() }
              : undefined,
          {
            revalidate: false,
          }
        )
        onClose()
      },
    }
  )

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>We've updated our Terms of Use</DialogTitle>
        </DialogHeader>

        <DialogBody className="prose text-foreground [&_p]:mt-0 [&_p]:last:mb-0">
          <section>
            <p>
              These changes have been made to better serve you and to reflect recent
              developments in our services.
            </p>
          </section>

          <section>
            <b>What's new?</b>
            <p>
              We included new Feature-Specific Terms, regarding token distribution
              and pool management.
            </p>
          </section>

          <section>
            <p>
              Please review and accept the updated Terms of Use to continue using our
              services. If you do not agree with the new Terms of Use, you can close
              your account free of charge.
            </p>

            <p>
              <Anchor variant="highlighted" href="/terms-of-use" target="_blank">
                Click here
              </Anchor>{" "}
              to review the new Terms of Use.
            </p>
          </section>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={() => onSubmit({ tosAccepted: new Date() })}
            colorScheme="primary"
            className="w-full"
            isLoading={isLoading}
          >
            I agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { TermsOfUseUpdateDialog }
