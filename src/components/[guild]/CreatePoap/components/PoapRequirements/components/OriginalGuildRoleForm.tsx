import { Flex, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { forwardRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Role from "requirements/Guild/components/Role"

const OriginalGuildRoleForm = forwardRef(({ onAdd }: any, ref: any) => {
  const { id } = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      type: "GUILD_ROLE",
      data: {
        guildId: id,
      },
    },
  })

  return (
    <FormProvider {...methods}>
      <Stack spacing="4">
        <Role baseFieldPath="" />

        <Flex justifyContent={"right"} pt="6">
          <Button
            colorScheme="green"
            onClick={methods.handleSubmit(onAdd)}
            ml="auto"
          >
            Add requirement
          </Button>
        </Flex>
      </Stack>
    </FormProvider>
  )
})

export default OriginalGuildRoleForm
