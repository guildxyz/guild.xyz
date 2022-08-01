import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Controller, useFormContext, useWatch } from "react-hook-form"

type Props = {
  fieldNameBase?: string
  onSubmit: (data?: Record<string, any>) => void
  isLoading?: boolean
  loadingText?: string
}

const GoogleDocSetupCard = ({
  fieldNameBase,
  onSubmit,
  isLoading,
  loadingText,
}: Props): JSX.Element => {
  const { control, handleSubmit } = useFormContext()
  const mimeType = useWatch({
    control,
    name: fieldNameBase?.length
      ? `${fieldNameBase}.platformGuildData.mimeType`
      : "platformGuildData.mimeType",
  })

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <Heading as="h3" fontFamily="display">
            Access settings
          </Heading>

          <FormControl>
            <FormLabel>Access type:</FormLabel>
            <Controller
              name={
                fieldNameBase?.length
                  ? `${fieldNameBase}.platformGuildData.role`
                  : "platformGuildData.role"
              }
              control={control}
              defaultValue="reader"
              render={({ field: { onChange, value, ref } }) => (
                <RadioGroup ref={ref} onChange={onChange} value={value}>
                  <Stack>
                    <Radio value="reader">Reader</Radio>
                    {mimeType !== "application/vnd.google-apps.folder" && (
                      <Radio value="commenter">Commenter</Radio>
                    )}
                    <Radio value="writer">Writer</Radio>
                  </Stack>
                </RadioGroup>
              )}
            />
          </FormControl>

          <Flex justifyContent="end">
            <Button
              colorScheme="green"
              onClick={handleSubmit(onSubmit, console.log)}
              isLoading={isLoading}
              loadingText={loadingText}
            >
              Gate this file
            </Button>
          </Flex>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default GoogleDocSetupCard
