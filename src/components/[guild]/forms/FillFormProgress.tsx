import { HStack, Progress, Text } from "@chakra-ui/react"
import FloatingFooter from "components/common/FloatingFooter"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"

const FillFormProgress = ({ children }: PropsWithChildren<unknown>) => {
  const { watch } = useFormContext()
  const formValues = watch()
  const formFieldsCount = Object.keys(formValues).length
  const formValuesCount = Object.values(formValues).filter(
    (v) => v?.length > 0
  ).length

  const progress = Number(((formValuesCount * 100) / formFieldsCount).toFixed(0))
  const progressText = `${progress}%`

  return (
    <FloatingFooter maxWidth="container.md">
      <HStack justify="space-between" py={3} px={{ base: 2, md: 3 }}>
        <Text colorScheme="gray" fontWeight="semibold" fontSize="sm">
          Form {progressText} completed
        </Text>

        {children}
      </HStack>
      <Progress
        hasStripe
        borderRadius="none"
        h={1}
        w="100%"
        value={progress}
        colorScheme="primary"
        sx={{
          "> div": {
            transitionProperty: "width",
          },
        }}
      />
    </FloatingFooter>
  )
}

export default FillFormProgress
