import { Text } from "@chakra-ui/react"
import PaginationButtons from "./PaginationButtons"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

const AddRolesAndRequirements = ({ activeStep, prevStep, nextStep }: Props) => {
  const handleNextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    nextStep()
  }

  return (
    <>
      <Text>
        You can have multiple roles with different requirements. By default there's
        an open one that anyone can get by just connecting their wallet. Go ahead and
        set requirements for it, or add a new role below!
      </Text>
      <PaginationButtons
        activeStep={activeStep}
        prevStep={prevStep}
        isPrevDisabled
        nextStep={handleNextStep}
      />
    </>
  )
}

export default AddRolesAndRequirements
