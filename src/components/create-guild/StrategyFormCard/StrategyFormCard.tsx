import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import useStrategiesList from "./hooks/useStrategiesList"

type Props = {
  index: number
  onRemove?: () => void
}

const StrategyFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext()

  const type = getValues(`requirements.${index}.type`)
  const strategies = useStrategiesList()

  return (
    <ColorCard color={RequirementTypeColors[type]}>
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          position="relative"
          isRequired
          isInvalid={errors?.requirements?.[index]?.value}
        >
          <FormLabel>Pick a strategy:</FormLabel>
          <Select
            options={strategies?.map((strategy) => ({
              label:
                strategy?.toString().charAt(0).toUpperCase() +
                strategy?.toString().slice(1),
              value: strategy,
            }))}
            onChange={(newValue) =>
              setValue(`requirements.${index}.value`, newValue.value)
            }
          />
          <Input
            type="hidden"
            {...register(`requirements.${index}.value`, {
              required: "This field is required.",
            })}
          />
          {/* <FormHelperText>
            TODO
          </FormHelperText> */}
          <FormErrorMessage>
            {errors?.requirements?.[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>

        <Link
          href="https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies"
          isExternal
        >
          <Text fontSize="sm">Snapshot strategies</Text>
          <Icon ml={1} as={ArrowSquareOut} />
        </Link>
      </VStack>
    </ColorCard>
  )
}

export default StrategyFormCard
