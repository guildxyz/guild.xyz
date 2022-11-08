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
        Your guild consists of roles that the members can satisfy the requirements of
        to gain access to their rewards. By default there's an open one that anyone
        can get by just connecting their wallet. Go ahead and edit it, and add new
        roles below!
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
