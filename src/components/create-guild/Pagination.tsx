import { Flex, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"
import { useCreateGuildContext } from "./CreateGuildContext"

type Props = {
  nextButtonDisabled?: boolean
}

const Pagination = ({
  nextButtonDisabled,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "lg" })
  const { activeStep, prevStep, nextStep } = useCreateGuildContext()
  const router = useRouter()

  return (
    <Flex justifyContent="right" w="full">
      <Button
        flexShrink={0}
        size={buttonSize}
        mr={2}
        onClick={activeStep === 1 ? () => router.push("/create-guild") : prevStep}
      >
        Previous
      </Button>
      {children ?? (
        <Button
          flexShrink={0}
          size={buttonSize}
          colorScheme="green"
          isDisabled={nextButtonDisabled}
          onClick={nextStep}
        >
          Next
        </Button>
      )}
    </Flex>
  )
}

export default Pagination
