import { Text, useDisclosure } from "@chakra-ui/react"
import PaginationButtons from "../PaginationButtons"
import SendDiscordJoinButtonModal from "./components/SendDiscordJoinButtonModal"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

export type SummonMembersForm = {
  channelId: string
  title: string
  description: string
  button: string
}

const SummonMembers = ({ activeStep, prevStep, nextStep }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Text>
        If you're satisfied with everything, it's time to invite your community to
        join!
      </Text>
      <PaginationButtons
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={onOpen}
        nextLabel="Send Discord join button"
      />
      <SendDiscordJoinButtonModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={nextStep}
      />
    </>
  )
}

export default SummonMembers
