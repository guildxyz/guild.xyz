import { Icon, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Link from "components/common/Link"
import { ArrowSquareOut, Plus } from "phosphor-react"
import { useFieldArray } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import Strategy from "./SnapshotForm/components/Strategy"

const SnapshotForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    name: `${baseFieldPath}.data.strategies`,
  })

  return (
    <Stack spacing={4} alignItems="start" w="full">
      <Text>You can define one or more Snapshot strategies below.</Text>

      <Stack spacing={2} w="full">
        {fields?.map((field, fieldIndex) => (
          <Strategy
            key={field.id}
            index={fieldIndex}
            baseFieldPath={baseFieldPath}
            onRemove={remove}
          />
        ))}

        <Button leftIcon={<Icon as={Plus} />} onClick={() => append({})}>
          Add strategy
        </Button>
      </Stack>

      <Link
        href="https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies"
        isExternal
      >
        <Text fontSize="sm">Snapshot strategies</Text>
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </Stack>
  )
}

export default SnapshotForm
