import { HStack, Select, Stack, Text } from "@chakra-ui/react"
import { useController, useWatch } from "react-hook-form"
import { Requirement } from "types"
import pluralize from "utils/pluralize"

type Props = {
  requirements?: Requirement[]
}

const LogicFormControl = ({
  requirements: requirementsFromProps,
}: Props): JSX.Element => {
  const requirementsFromFormContext = useWatch({ name: "requirements" })
  const requirements = requirementsFromProps || requirementsFromFormContext
  const requirementCount = requirements?.length ?? 0
  const {
    field: { onChange: logicOnChange, value: logic },
  } = useController({
    name: "logic",
    defaultValue: "AND",
  })

  const {
    field: { onChange: anyOfNumOnChange, value: anyOfNum },
  } = useController({
    name: "anyOfNum",
    defaultValue: 1,
  })

  return (
    <Stack alignItems="start" direction={{ base: "column", sm: "row" }}>
      <Text as="span" flexShrink={0} pt={2}>
        Should meet
      </Text>
      <Select
        w={{ base: "full", sm: "20" }}
        flexShrink={0}
        onChange={(e) => {
          switch (e.target.value) {
            case "0": {
              logicOnChange("AND")
              anyOfNumOnChange(1)
              break
            }
            case "1": {
              logicOnChange("OR")
              anyOfNumOnChange(parseInt(e.target.value))
              break
            }
            default: {
              logicOnChange("ANY_OF")
              anyOfNumOnChange(parseInt(e.target.value))
              break
            }
          }
        }}
        defaultValue={(logic === "AND" ? 0 : anyOfNum).toString()}
      >
        {Array.from({ length: requirementCount }, (_, i) => (
          <option value={i.toString()} key={i}>
            {i || "All"}
          </option>
        ))}
      </Select>

      <HStack alignItems="start" pt="px">
        <Text as="span" flexShrink={0} pt={2}>
          {pluralize(
            logic === "AND" ? requirementCount : anyOfNum,
            "requirement",
            false
          )}
          {logic === "AND" || ` out of ${requirementCount}`}
        </Text>
      </HStack>
    </Stack>
  )
}

export default LogicFormControl
