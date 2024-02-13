import {
  Box,
  Collapse,
  Flex,
  HStack,
  RadioGroupProps,
  RadioProps,
  Stack,
  Text,
  UseRadioGroupProps,
  forwardRef,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import Button from "components/common/Button"
import { Field } from "../../schemas"

type Props = {
  field: Field | CreateForm["fields"][number]
} & Omit<RadioGroupProps, "children">

// TODO: should we pass that ref down? (probably for focus management?)
const Rate = forwardRef<Props, "input">(({ field, ...props }, _ref) => {
  // We probably won't run into this case, but needed to add this line to get valid intellisense
  if (field.type !== "RATE") return null

  return (
    <Box
      sx={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0px, black 10px, black calc(100% - 10px), transparent)",
      }}
      mx="-2"
    >
      <Flex overflowX={"auto"} px="2">
        <Stack spacing={1} flex="1 0 auto">
          <RateRadioGroup
            options={field.options?.map((option) => ({
              value:
                typeof option === "string" || typeof option === "number"
                  ? option.toString()
                  : option.value.toString(),
              label:
                typeof option === "string" || typeof option === "number"
                  ? option.toString()
                  : option.value.toString(),
            }))}
            {...props}
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
      </Flex>
    </Box>
  )
})

/**
 * The general RadioButtonGroup component doesn't work properly (it can't handle
 * disabled state?), so I decided to add a really simple radio group component here &
 * we'll refactor it later if needed.
 */
const RateRadioGroup = ({
  options,
  ...props
}: {
  options: { label: string; value: string }[]
} & UseRadioGroupProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup(props)

  const group = getRootProps()

  return (
    <HStack w="full" {...group}>
      {options?.map(({ label, value }) => {
        const radio = getRadioProps({ value })
        return (
          <RateRadioButton key={value} {...radio} isDisabled={props.isDisabled}>
            {label}
          </RateRadioButton>
        )
      })}
    </HStack>
  )
}

const RateRadioButton = (props: RadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label" w="full">
      <input {...input} />
      <Button
        as="div"
        {...checkbox}
        cursor="pointer"
        w="full"
        size="sm"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        _checked={{
          bg: "primary.500",
        }}
      >
        {props.children}
      </Button>
    </Box>
  )
}

export default Rate
