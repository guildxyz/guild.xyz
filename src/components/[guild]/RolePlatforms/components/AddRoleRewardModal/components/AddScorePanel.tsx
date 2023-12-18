import {
  Box,
  ButtonGroup,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Img,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { CaretDown } from "phosphor-react"
import RewardImagePicker from "platforms/SecretText/SecretTextDataForm/components/RewardImagePicker"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import Star from "static/icons/star.svg"
import { PlatformType } from "types"

type Props = {
  onSuccess: () => void
}

const AddScorePanel = ({ onSuccess }: Props) => {
  const { id, guildPlatforms } = useGuild()
  const methods = useForm({
    mode: "all",
  })

  const isFirstScoreReward = !guildPlatforms.some(
    (gp) => gp.platformId === PlatformType.SCORE
  )

  const { isOpen: isAppearanceOpen, onToggle: onAppearanceToggle } = useDisclosure({
    defaultIsOpen: isFirstScoreReward,
  })

  const {
    register,
    setValue,
    formState: { errors },
  } = methods

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const amount = useWatch({ control: methods.control, name: "amount" })
  const name = useWatch({ control: methods.control, name: "name" })
  const imageUrl = useWatch({ control: methods.control, name: "imageUrl" })

  const onSubmit = (data) => {
    append({
      guildPlatform: {
        platformName: "SCORE",
        platformGuildId: `score-${id}-${data.name || "points"}`,
        platformGuildData: {
          name: data.name,
          imageUrl: data.imageUrl,
        },
      },
      isNew: true, // not sure if needed
      platformRoleData: {
        score: data.amount,
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
          <Collapse in={isAppearanceOpen} startingHeight={"24px"}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              pos="relative"
              onClick={!isAppearanceOpen ? onAppearanceToggle : null}
              cursor={!isAppearanceOpen && "pointer"}
              alignItems={{ sm: "flex-end" }}
              gap={4}
              mb="1"
            >
              <IconButton
                pos="absolute"
                right="0"
                top="-1"
                size="sm"
                variant={"ghost"}
                borderRadius={"full"}
                _hover={{ bg: "transparent" }}
                icon={<CaretDown />}
                onClick={isAppearanceOpen ? onAppearanceToggle : null}
                transform={isAppearanceOpen && "rotate(-180deg)"}
                transition="transform .3s"
                aria-label="Toggle appearance"
                zIndex={1}
              />
              <FormControl isInvalid={!!errors?.rolePlatforms?.[0]?.name} flex="1">
                <Text fontWeight={"medium"} mb="2">
                  {`Appearance `}
                  <Text
                    as="span"
                    colorScheme={"gray"}
                    opacity={isAppearanceOpen ? "1" : "0"}
                    transition={"opacity .2s"}
                  >
                    (optional)
                  </Text>
                </Text>
                <HStack>
                  <RewardImagePicker defaultIcon={Star} />
                  <Input {...register("name")} placeholder="points" />
                </HStack>
                <FormErrorMessage>
                  {errors?.name?.message as string}
                </FormErrorMessage>
              </FormControl>
              <Box flex="1">
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray"
                  textTransform="uppercase"
                  mb="2"
                  opacity={isAppearanceOpen ? "1" : "0"}
                  transition={"opacity .2s"}
                >
                  Preview
                </Text>
                <HStack
                  h="40px"
                  px="4"
                  w="full"
                  borderWidth={1}
                  borderStyle={"dashed"}
                  borderRadius={"lg"}
                >
                  {imageUrl ? <Img src={imageUrl} boxSize="5" /> : <Star />}
                  <Text>
                    Get{" "}
                    <Text as="span" fontWeight={"semibold"}>
                      {`50 ${name || "points"}`}
                    </Text>
                  </Text>
                </HStack>
              </Box>
            </Stack>
          </Collapse>

          <Divider my={isAppearanceOpen ? 8 : 6} transition={"margin .2s"} />

          <HStack>
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
                  <ShortcutButton amount={5} />
                  <ShortcutButton amount={10} />
                  <ShortcutButton amount={50} />
                  <ShortcutButton amount={100} />
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

const ShortcutButton = ({ amount }) => {
  const { setValue, control } = useFormContext()
  const imageUrl = useWatch({ control, name: "imageUrl" })

  return (
    <Button
      w="full"
      leftIcon={imageUrl ? <Img src={imageUrl} boxSize="4" /> : <Star />}
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
