import CloseButton from "../CloseButton"

type Props = {
  onClick: () => void
}

const ModalCloseButton = ({ onClick }: Props): JSX.Element => (
  <CloseButton
    aria-label="Close modal"
    onClick={onClick}
    position="absolute"
    top="7"
    right="7"
    h="9"
    w="9"
  />
)

export default ModalCloseButton
