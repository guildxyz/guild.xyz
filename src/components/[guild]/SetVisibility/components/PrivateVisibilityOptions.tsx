import {
  ButtonGroup,
  Collapse,
  FormControl,
  FormLabel,
  Text,
  VStack,
} from "@chakra-ui/react"
import { SetVisibilityForm } from "components/[guild]/SetVisibility"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import ControlledSelect from "components/common/ControlledSelect"
import { useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const PrivateVisibilityOptions = () => {
  const { roles } = useGuild()
  const { setValue } = useFormContext<SetVisibilityForm>()

  const visibilityRoleId = useWatch({ name: "visibilityRoleId" })

  const [shouldSatisfyThisRole, setShouldSatisfyThisRole] = useState(
    !visibilityRoleId
  )

  const roleOptions = useMemo(() => {
    if (!roles) return []
    return roles.map(({ name, id, imageUrl }) => ({
      value: id,
      label: name,
      img: imageUrl,
    }))
  }, [roles])

  return (
    <VStack
      // 1em -> Logo SVG's width (and height)
      // --chakra-space-3 -> Logo's parent circle's padding (times two, since left + right)
      // --chakra-space-5 -> Whole option's left padding
      // --chakra-space-4 -> Flex gap
      ml={`calc(1em + var(--chakra-space-3) * 2 + var(--chakra-space-5) + var(--chakra-space-4))`}
      mr={6}
      mb={3}
      alignItems={"start"}
      spacing={2}
    >
      <ButtonGroup size="sm" w="full">
        <Button
          colorScheme={shouldSatisfyThisRole ? "indigo" : undefined}
          autoFocus={false}
          w="full"
          borderRadius="md"
          onClick={() => {
            setValue("visibilityRoleId", null, { shouldDirty: true })
            setShouldSatisfyThisRole(true)
          }}
        >
          This role
        </Button>

        <Button
          colorScheme={!shouldSatisfyThisRole ? "indigo" : undefined}
          autoFocus={false}
          w="full"
          borderRadius="md"
          onClick={() => {
            setShouldSatisfyThisRole(false)
          }}
        >
          Another role
        </Button>
      </ButtonGroup>

      {/* FormControl shouldn't be needed when only the Text is shown, but this is the only way I could get a smooth Collapse */}
      <FormControl>
        {shouldSatisfyThisRole ? (
          <Text fontSize={"sm"} colorScheme="gray" fontWeight={500}>
            Users will only see the role if they qualify for it.
          </Text>
        ) : (
          <FormLabel fontSize={"sm"}>
            Users will only see the role if they hold:
          </FormLabel>
        )}

        {/* unmountOnExit is used, so autoFocus triggers focus every time, the "Another role" option is selected */}
        <Collapse
          in={!shouldSatisfyThisRole}
          unmountOnExit
          style={{ padding: "1px", margin: "-1px" }}
        >
          <ControlledSelect
            noResultText="No other roles found"
            autoFocus
            name="visibilityRoleId"
            rules={{
              required: "Please select a role",
              pattern: {
                value: /^[0-9]*$/i,
                message: "Please input a valid role ID",
              },
              validate: (value) =>
                !!roleOptions?.find((role) => role.value === value) ||
                "Please select a role",
            }}
            options={roleOptions}
          />
        </Collapse>
      </FormControl>
    </VStack>
  )
}

export default PrivateVisibilityOptions
