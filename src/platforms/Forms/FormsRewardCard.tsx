import { Circle, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { Form } from "components/[guild]/CreateFormModal/schemas"
import Button from "components/common/Button"
import RewardCard from "components/common/RewardCard"
import { PencilSimpleLine } from "phosphor-react"
import FillFormModal from "./FillFormModal"

type Props = {
  form: Form
}

const FormsRewardCard = ({ form }: Props) => {
  const imageBgColor = useColorModeValue("gray.700", "gray.600")

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <RewardCard
      label="Form"
      title={form.name}
      image={
        <Circle size={10} bgColor={imageBgColor}>
          <PencilSimpleLine color="white" />
        </Circle>
      }
      colorScheme="GUILD"
    >
      <Button onClick={onOpen} colorScheme="GUILD">
        Fill form
      </Button>

      <FillFormModal form={form} isOpen={isOpen} onClose={onClose} />
    </RewardCard>
  )
}

export default FormsRewardCard
