import { HStack, Progress, Text } from "@chakra-ui/react"
import { StickyFooter } from "components/common/FloatingFooter"
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
  const progressText = `${isNaN(progress) ? 0 : progress}%`

  return (
    <StickyFooter>
      <HStack justify="space-between" p={3}>
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
        value={isNaN(progress) ? 0 : progress}
        colorScheme="primary"
        sx={{
          "> div": {
            transitionProperty: "width",
          },
        }}
      />
    </StickyFooter>
  )
}

export default FillFormProgress
