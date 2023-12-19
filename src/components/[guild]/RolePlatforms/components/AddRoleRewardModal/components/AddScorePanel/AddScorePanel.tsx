import {
  Box,
  ButtonGroup,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Img,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import Star from "static/icons/star.svg"
import { PlatformType } from "types"
import AddNewScoreType from "./components/AddNewScoreType"
import ExistingScoreTypeSelect from "./components/ExistingScoreTypeSelect"

type Props = {
  onSuccess: () => void
}

type AddScoreFormType = {
  guildPlatformId: number
  amount: string
  name: string
  imageUrl: string
}

const AddScorePanel = ({ onSuccess }: Props) => {
  const { id, guildPlatforms } = useGuild()

  const existingScoreRewards = guildPlatforms.filter(
    (gp) => gp.platformId === PlatformType.SCORE
  )

  const methods = useForm<AddScoreFormType>({
    mode: "all",
    defaultValues: {
      guildPlatformId: existingScoreRewards?.[0]?.id,
    },
  })
  const {
    control,
    setValue,
    formState: { errors },
  } = methods

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const amount = useWatch({ control, name: "amount" })
  const selectedExistingId = useWatch({
    control,
    name: "guildPlatformId",
  })
  const localName = useWatch({ control, name: "name" })
  const localImageUrl = useWatch({ control, name: "imageUrl" })

  const { name: selectedName, imageUrl: selectedImageUrl } =
    existingScoreRewards?.find((gp) => gp.id === selectedExistingId)
      ?.platformGuildData ?? {}

  const name = selectedName ?? localName
  const imageUrl = selectedExistingId ? selectedImageUrl : localImageUrl // not just ?? so it doesn't stay localImageUrl if we upload an image then switch to an existing type without image

  const onSubmit = (data) => {
    append({
      ...(selectedExistingId
        ? { guildPlatformId: selectedExistingId }
        : {
            guildPlatform: {
              platformName: "SCORE",
              platformGuildId: `score-${id}-${data.name.toLowerCase() || "points"}`,
              platformGuildData: {
                name: data.name,
                imageUrl: data.imageUrl,
              },
            },
          }),
      isNew: true,
      platformRoleData: {
        score: data.amount.toString(),
      },
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <Stack spacing={8}>
        <Text colorScheme="gray" fontWeight="semibold">
          Gamify your guild with a score system, so users can collect points / XP /
          your custom branded score, and compete on a leaderboard. You’ll also be
          able to set score based requirements for satisfying higher level roles!
        </Text>
        <Box>
          <Box>
            {!!existingScoreRewards.length && (
              <ExistingScoreTypeSelect
                existingScoreRewards={existingScoreRewards}
                selectedExistingId={selectedExistingId}
              />
            )}
            <Collapse
              in={!existingScoreRewards.length || selectedExistingId === null}
            >
              <AddNewScoreType
                name={name}
                imageUrl={imageUrl}
                isOptional={!existingScoreRewards.length}
              />
              <Divider mt={8} mb={7} />
            </Collapse>
          </Box>

          <HStack mt={1}>
            <FormControl isInvalid={!!errors?.amount}>
              <FormLabel>{`How many ${name || "points"} to get?`}</FormLabel>
              <Stack direction={{ base: "column", md: "row" }}>
                <NumberInput
                  value={amount}
                  onChange={(newValue) => {
                    setValue("amount", newValue)
                  }}
                >
                  <NumberInputField placeholder="0" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <ButtonGroup flex="1" size={{ base: "sm", md: "md" }}>
                  <ShortcutButton amount={5} imageUrl={imageUrl} />
                  <ShortcutButton amount={10} imageUrl={imageUrl} />
                  <ShortcutButton amount={50} imageUrl={imageUrl} />
                  <ShortcutButton amount={100} imageUrl={imageUrl} />
                </ButtonGroup>
              </Stack>
              <FormErrorMessage>
                {errors?.amount?.message as string}
              </FormErrorMessage>
            </FormControl>
          </HStack>
        </Box>
        <Button
          colorScheme="indigo"
          w="max-content"
          ml="auto"
          onClick={methods.handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </Stack>
    </FormProvider>
  )
}

const ShortcutButton = ({ amount, imageUrl }) => {
  const { setValue } = useFormContext()

  return (
    <Button
      w="full"
      leftIcon={
        imageUrl ? (
          <Img src={imageUrl} boxSize="4" borderRadius={"full"} />
        ) : (
          <Star />
        )
      }
      h={{ md: "10" }}
      onClick={() => {
        setValue("amount", amount)
      }}
    >
      {amount}
    </Button>
  )
}

export default AddScorePanel
