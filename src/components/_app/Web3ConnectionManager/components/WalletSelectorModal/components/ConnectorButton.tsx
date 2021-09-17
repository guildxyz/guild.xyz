import { Button, Img } from "@chakra-ui/react"

type Props = {
  name: string
  onClick: () => void
  iconUrl: string
  disabled: boolean
  isActive: boolean
  isLoading: boolean
}

const ConnectorButton = ({
  name,
  onClick,
  iconUrl,
  disabled,
  isActive,
  isLoading,
}: Props): JSX.Element => (
  <Button
    onClick={onClick}
    rightIcon={<Img src={`/walletLogos/${iconUrl}`} h="5" alt={`${name} logo`} />}
    disabled={disabled}
    isLoading={isLoading}
    spinnerPlacement="end"
    loadingText={`${name} - connecting...`}
    isFullWidth
    size="xl"
    justifyContent="space-between"
    border={isActive && "2px"}
    borderColor="primary.500"
  >
    {`${name} ${isActive ? " - connected" : ""}`}
  </Button>
)

export default ConnectorButton
