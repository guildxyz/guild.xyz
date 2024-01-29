import {
  Center,
  ChakraProps,
  Flex,
  FormControl,
  Grid,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Reorder } from "framer-motion"
import { DotsSixVertical, X } from "phosphor-react"
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Rest } from "types"
import { CreateFormParams } from "../../schemas"

type Props = {
  index: number
}

const SingleChoiceSetup = ({ index }: Props) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CreateFormParams>()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: `fields.${index}.options`,
  })

  // TODO: try to find a better solution for default value
  useEffect(() => {
    if (fields.length > 0) return
    append({
      value: "Option 1",
    })
  }, [])

  const addOptionRef = useRef<HTMLInputElement>(null)

  const allowOther = useWatch({
    name: `fields.${index}.allowOther`,
  })

  const onReorder = (newOrder: string[]) => {
    const originalOrder = fields.map((field) => field.id)

    const indexesToSwap: number[] = []

    for (const [i, field] of originalOrder.entries()) {
      const fieldIndexInNewOrder = newOrder.findIndex((f) => f === field)
      if (fieldIndexInNewOrder !== i) indexesToSwap.push(i)
    }

    const [indexA, indexB] = indexesToSwap
    swap(indexA, indexB)
  }

  return (
    <>
      <Reorder.Group
        axis="y"
        values={fields.map((field) => field.id)}
        onReorder={onReorder}
      >
        {fields.map((field, optionIndex) => (
          <Reorder.Item
            key={field.id}
            value={field.id}
            style={{
              marginBottom: "var(--chakra-sizes-2)",
            }}
          >
            <OptionLayout
              action={<RemoveButton onClick={() => remove(optionIndex)} />}
              draggable
            >
              <FormControl>
                <Input
                  {...register(`fields.${index}.options.${optionIndex}.value`)}
                  placeholder="Add option"
                />
                <FormErrorMessage>
                  {/* TODO: proper types */}
                  {
                    (errors.fields?.[index] as any)?.options?.[optionIndex]?.value
                      ?.message
                  }
                </FormErrorMessage>
              </FormControl>
            </OptionLayout>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Stack mt={-2}>
        <OptionLayout
          action={
            !allowOther && (
              <HStack spacing={1} pl={1}>
                <Text
                  as="span"
                  fontWeight="bold"
                  fontSize="xs"
                  textTransform="uppercase"
                  colorScheme="gray"
                >
                  OR
                </Text>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setValue(`fields.${index}.allowOther`, true)}
                >
                  Add "Other"...
                </Button>
              </HStack>
            )
          }
        >
          <Input
            ref={addOptionRef}
            placeholder="Add option"
            onChange={(e) => {
              if (!fields.every((field) => !!field.value)) return
              append({
                value: e.target.value,
              })
              addOptionRef.current.value = ""
            }}
          />
        </OptionLayout>

        {allowOther && (
          <OptionLayout
            action={
              <RemoveButton
                onClick={() => setValue(`fields.${index}.allowOther`, false)}
              />
            }
          >
            <Input placeholder="Other..." isDisabled />
          </OptionLayout>
        )}
      </Stack>
    </>
  )
}

type OptionLayoutProps = {
  action: ReactNode
  draggable?: boolean
} & Rest

const draggableCenterProps: ChakraProps = {
  cursor: "grab",
  _groupHover: {
    height: 6,
    borderRadius: "md",
  },
  _groupFocusWithin: {
    height: 6,
    borderRadius: "md",
  },
  transition: "height 0.24s ease, border-radius 0.24s ease",
}

const draggableIconProps: ChakraProps = {
  transition: "opacity 0.24s ease",
  _groupHover: {
    opacity: 1,
  },
  _groupFocusWithin: {
    opacity: 1,
  },
}

const OptionLayout = ({
  children,
  action,
  draggable,
  ...props
}: PropsWithChildren<OptionLayoutProps>) => {
  const circleBgColor = useColorModeValue("white", "blackAlpha.300")

  return (
    <Grid templateColumns="2fr 1fr" gap={2} {...props}>
      <HStack w="full" role="group">
        <Center
          borderWidth={2}
          bgColor={circleBgColor}
          width={5}
          height={5}
          borderRadius="var(--chakra-sizes-2-5)"
          flexShrink={0}
          {...(draggable ? draggableCenterProps : undefined)}
        >
          <Icon
            as={DotsSixVertical}
            boxSize={3}
            opacity={0}
            {...(draggable ? draggableIconProps : undefined)}
          />
        </Center>
        {children}
      </HStack>

      <Flex alignItems="center">{action}</Flex>
    </Grid>
  )
}

const RemoveButton = (
  props: Omit<
    IconButtonProps,
    "aria-label" | "icon" | "rounded" | "boxSize" | "minW" | "minH" | "variant"
  >
) => (
  <IconButton
    aria-label="Remove"
    icon={<X />}
    rounded="full"
    boxSize={6}
    minW={6}
    minH={6}
    variant="unstyled"
    {...props}
  />
)

export default SingleChoiceSetup
