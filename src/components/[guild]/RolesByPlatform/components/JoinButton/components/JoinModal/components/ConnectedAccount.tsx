import ModalButton from "components/common/ModalButton"
import { Check } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  icon: JSX.Element
}

const ConnectedAccount = ({ icon, children }: PropsWithChildren<Props>) => (
  <ModalButton
    as="div"
    colorScheme="gray"
    variant="solidStatic"
    rightIcon={icon}
    leftIcon={<Check />}
    justifyContent="space-between"
    px="4"
  >
    {children}
  </ModalButton>
)

export default ConnectedAccount
