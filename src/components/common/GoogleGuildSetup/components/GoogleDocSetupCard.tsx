import { Flex, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { useFormContext, useWatch } from "react-hook-form"
import PermissionSelection from "./PermissionSelection"

type Props = {
  fieldNameBase?: string
  onSubmit: (data?: Record<string, any>) => void
  isLoading?: boolean
  loadingText?: string
  permissionField?: string
}

const GoogleDocSetupCard = ({
  fieldNameBase = "",
  onSubmit,
  isLoading,
  loadingText,
  permissionField,
}: Props): JSX.Element => {
  const { control, handleSubmit } = useFormContext()
  const mimeType = useWatch({
    control,
    name: `${fieldNameBase}platformGuildData.mimeType`,
  })

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <PermissionSelection
            fieldName={permissionField ?? `${fieldNameBase}platformRoleId`}
            mimeType={mimeType}
          />
          <Flex justifyContent="end">
            {onSubmit && (
              <Button
                colorScheme="green"
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
                loadingText={loadingText}
                data-dd-action-name="Gate file (google setup - permission selection)"
              >
                Gate file
              </Button>
            )}
          </Flex>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default GoogleDocSetupCard
