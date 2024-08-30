import {
  CloseButton,
  Divider,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import { Info } from "@phosphor-icons/react"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import useRemovePlatform from "./hooks/useRemovePlatform"

type Props = {
  removeButtonColor: string
  isPlatform: boolean
}

const RemovePlatformButton = ({
  removeButtonColor,
  isPlatform,
}: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading, isSigning } = useRemovePlatform(onClose)

  return (
    <>
      <Tooltip label="Remove reward...">
        <CloseButton
          size="sm"
          color={removeButtonColor}
          rounded="full"
          aria-label="Remove reward"
          zIndex="1"
          onClick={onOpen}
        />
      </Tooltip>

      <ConfirmationAlert
        isLoading={isLoading}
        loadingText={isSigning && "Check your wallet"}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSubmit}
        title="Remove reward"
        description={
          <>
            Are you sure you want to remove this reward?
            {isPlatform && <AlreadyGrantedAccessesWillRemainInfo />}
          </>
        }
        confirmationText="Remove"
      />
    </>
  )
}

export const AlreadyGrantedAccessesWillRemainInfo = () => (
  <>
    <Divider mb="4" mt="6" />
    <Text colorScheme="gray" display="flex">
      <Icon as={Info} mt="3px" mr="1.5" />
      Already granted accesses will remain as is on the platform.
    </Text>
  </>
)

export default RemovePlatformButton
