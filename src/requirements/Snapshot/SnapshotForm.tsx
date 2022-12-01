import { FormControl, FormLabel, Icon, Input, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import Link from "components/common/Link"
import { ArrowSquareOut, Plus } from "phosphor-react"
import { useEffect } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import Strategy from "./SnapshotForm/components/Strategy"

const SnapshotForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    name: `${baseFieldPath}.data.strategies`,
  })

  useEffect(() => {
    if (fields?.length) return
    setTimeout(() => append({}), 600)
  }, [])

  return (
    <Stack spacing={4} alignItems="start" w="full">
      {/* TODO: why don't we use the baseFieldPath.chain for this? */}
      <ChainPicker controlName={`${baseFieldPath}.data.chainId`} />

      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.space}>
        <FormLabel>Space</FormLabel>

        <Input {...register(`${baseFieldPath}.data.space`)} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.space?.message}
        </FormErrorMessage>
      </FormControl>

      <Text as="span" fontWeight="medium">
        Strategies
      </Text>

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
