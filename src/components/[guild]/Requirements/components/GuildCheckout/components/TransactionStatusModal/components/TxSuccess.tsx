import {
  Center,
  Divider,
  Flex,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { DotLottiePlayer } from "@dotlottie/react-player"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import Button from "components/common/Button"
import useMembership from "components/explorer/hooks/useMembership"
import { PropsWithChildren } from "react"
import TransactionLink from "./TransactionLink"
import TransactionModalCloseButton from "./TransactionModalCloseButton"

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
      <ModalBody>
        <Flex direction="column">
          <Center mb={10} position="relative" width="full" height={28}>
            <DotLottiePlayer
              autoplay
              // The checkmark fills around 30% of the SVG, so we can scale it up here
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "var(--chakra-sizes-80)",
                height: "var(--chakra-sizes-80)",
                pointerEvents: "none",
              }}
              src="/success_lottie.json"
              className="keep-colors"
            />
          </Center>
        </Flex>

        <Text mb={2}>
          {successText ??
            (isMember
              ? "Transaction successful! Your access is being rechecked."
              : "Transaction successful! Join the Guild now to get access")}
        </Text>

        {successLinkComponent ?? <TransactionLink />}

        {children && (
          <>
            <Divider mb="6" />
            {children}
          </>
        )}
      </ModalBody>

      <ModalFooter>
        {isMember ? (
          <TransactionModalCloseButton />
        ) : (
          <Button size="lg" colorScheme={"green"} w="full" onClick={openJoinModal}>
            Join guild
          </Button>
        )}
      </ModalFooter>
    </>
  )
}

export default TxSuccess
