import { Flex, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { useFormContext, useWatch } from "react-hook-form"
import capitalize from "utils/capitalize"
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
    name: `${fieldNameBase}platformRoleData.mimeType`,
  })

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <PermissionSelection
            fieldName={permissionField ?? `${fieldNameBase}platformRoleData.role`}
            mimeType={mimeType}
          />

          <Flex justifyContent="end">
            <Button
              colorScheme="green"
              onClick={handleSubmit(onSubmit, console.log)}
              isLoading={isLoading}
              loadingText={loadingText}
            >
              {capitalize(
                `${fieldNameBase?.length ? "create Guild to " : ""}gate file`
              )}
            </Button>
          </Flex>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default GoogleDocSetupCard
