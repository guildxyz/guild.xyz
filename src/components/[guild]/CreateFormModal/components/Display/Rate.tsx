import {
  Box,
  ButtonGroup,
  Collapse,
  HStack,
  Stack,
  Text,
  UseRadioProps,
  useRadio,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { CreateFieldParams } from "../../schemas"

type Props = {
  field: CreateFieldParams
  isDisabled?: boolean
}

const Rate = ({ field, isDisabled }: Props) => {
  // We probably won't run into this case, but needed to add this line to get valid intellisense
  if (field.type !== "RATE") return null

  return (
    <Stack spacing={0}>
      <RateRadioGroup
        isDisabled={isDisabled}
        // TODO: we'll need to use option for display, but option.value for setup...
        options={field.options?.map((option) => ({
          value:
            typeof option === "string" || typeof option === "number"
              ? option
              : option.value,
          label:
            typeof option === "string" || typeof option === "number"
              ? option
              : option.value,
        }))}
      />

      <Collapse in={!!field.worstLabel || !!field.bestLabel} animateOpacity>
        <HStack justifyContent="space-between" fontSize="small">
          <Box h={6}>
            <Text as="span" colorScheme="gray">
              {field.worstLabel}
            </Text>
          </Box>

          <Box h={6}>
            <Text as="span" colorScheme="gray">
              {field.bestLabel}
            </Text>
          </Box>
        </HStack>
      </Collapse>
    </Stack>
  )
}

/**
 * The general RadioButtonGroup component doesn't work properly (it can't handle
 * disabled state?), so I decided to add a really simple radio group component here &
 * we'll refactor it later if needed.
 */
const RateRadioGroup = ({
  options,
  ...props
}: {
  options: { label: string | number; value: string | number }[]
} & UseRadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props)

  return (
    <>
      <input {...getInputProps()} />
      <ButtonGroup w="full">
        {options?.map(({ label, value }) => (
          <Button
            key={value}
            {...getRadioProps()}
            size="sm"
            w="full"
            borderRadius="lg"
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  )
}

export default Rate
