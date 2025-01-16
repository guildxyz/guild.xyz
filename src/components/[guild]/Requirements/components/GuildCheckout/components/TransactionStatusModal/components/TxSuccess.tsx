import { Button } from "@/components/ui/Button"
import { DialogBody, DialogFooter } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { DotLottiePlayer } from "@dotlottie/react-player"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import useMembership from "components/explorer/hooks/useMembership"
import { PropsWithChildren } from "react"
import { TransactionLink } from "./TransactionLink"
import { TransactionModalCloseButton } from "./TransactionModalCloseButton"

type Props = { successText?: string; successLinkComponent?: JSX.Element }

const TxSuccess = ({
  successText,
  successLinkComponent,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { isMember } = useMembership()
  const openJoinModal = useOpenJoinModal()

  return (
    <>
      <DialogBody>
        <div className="relative mb-10 flex size-28 w-full items-center justify-center">
          <DotLottiePlayer
            autoplay
            src="/success_lottie.json"
            className="keep-colors pointer-events-none w-[80%]"
          />
        </div>

        <p className="mb-2">
          {successText ??
            (isMember
              ? "Transaction successful! Your access is being rechecked."
              : "Transaction successful! Join the Guild now to get access")}
        </p>

        {successLinkComponent ?? <TransactionLink />}

        {children && (
          <>
            <Separator className="my-6" />
            {children}
          </>
        )}
      </DialogBody>

      <DialogFooter>
        {isMember ? (
          <TransactionModalCloseButton />
        ) : (
          <Button
            size="lg"
            colorScheme="success"
            className="w-full"
            onClick={openJoinModal}
          >
            Join guild
          </Button>
        )}
      </DialogFooter>
    </>
  )
}

export { TxSuccess }
