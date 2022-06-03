import {
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import useDropzone from "hooks/useDropzone"
import { File, Question, WarningCircle } from "phosphor-react"
import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { CreatePoapForm as CreatePoapFormType } from "types"
import useCreatePoap from "../hooks/useCreatePoap"
import useSavePoap from "../hooks/useSavePoap"
import { useCreatePoapContext } from "./CreatePoapContext"

type Props = {
  nextStep: () => void
  setStep: (step: number) => void
}

const CreatePoapForm = ({ nextStep, setStep }: Props): JSX.Element => {
  const methods = useForm<CreatePoapFormType>({
    mode: "all",
    defaultValues: {
      secret_code: Math.floor(100000 + Math.random() * 900000),
      event_template_id: 0,
      virtual_event: true,
      private_event: false,
      city: "",
      country: "",
    },
  })

  const {
    control,
    register,
    setValue,
    resetField,
    formState: { errors },
    handleSubmit,
  } = methods

  const { id } = useGuild()

  const startDate = useWatch({ control, name: "start_date" })
  const endDate = useWatch({ control, name: "end_date" })
  const expiryDate = useWatch({ control, name: "expiry_date" })

  useEffect(() => {
    if (!register) return
    register("image", { required: "This field is required." })
  }, [register])

  const { data: eventTemplatesData, isValidating: eventTemplatesLoading } =
    useSWRImmutable("https://api.poap.tech/event-templates?limit=1000")

  const [multiDay, setMultiDay] = useState(false)

  const { poapData, setPoapData } = useCreatePoapContext()
  const {
    onSubmit: onCreatePoapSubmit,
    isLoading: isCreatePoapLoading,
    response: createPoapResponse,
  } = useCreatePoap()
  const {
    onSubmit: onSavePoapSubmit,
    isLoading: isSavePoapLoading,
    response: savePoapResponse,
  } = useSavePoap()

  const onSubmit = (data: CreatePoapFormType) => {
    setPoapData(data)
    onCreatePoapSubmit(data)
  }

  useEffect(() => {
    if (!createPoapResponse) return
    setPoapData({ ...(poapData || {}), ...createPoapResponse })
    onSavePoapSubmit({
      poapId: createPoapResponse?.id,
      fancyId: createPoapResponse?.fancy_id,
      guildId: id,
    })
  }, [createPoapResponse])

  useEffect(() => {
    if (!savePoapResponse) return
    nextStep()
  }, [savePoapResponse])

  useEffect(() => {
    if (multiDay) return
    resetField("end_date")
  }, [multiDay])

  const {
    isDragActive,
    fileRejections,
    getRootProps,
    getInputProps,
    acceptedFiles,
  } = useDropzone({
    multiple: false,
    accept: "image/png",
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("image", accepted[0])
      }
    },
  })

  return (
    <FormProvider {...methods}>
      <Grid mb={12} templateColumns="repeat(2, 1fr)" rowGap={6} columnGap={4}>
        <GridItem colSpan={2}>
          <FormControl isRequired isInvalid={!!errors?.name}>
            <FormLabel>What are you commemorating?</FormLabel>
            <Input {...register("name", { required: "This field is required." })} />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl isRequired isInvalid={!!errors?.description}>
            <FormLabel>
              What do you want people to remember about this drop?
            </FormLabel>
            <Textarea
              {...register("description", {
                required: "This field is required.",
              })}
              className="custom-scrollbar"
              minH={32}
              placeholder="Explain what this POAP is about, including how the POAP will be distributed. This text is stored on the NFT metadata and displayed in the POAP mobile app and all across the POAP ecosystem. Drops in languages other than English still have to provide an English description."
            />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <Checkbox onChange={(e) => setMultiDay(e?.target?.checked)}>
            Multi-day Drop
          </Checkbox>
        </GridItem>

        <GridItem colSpan={2}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <FormControl isInvalid={!!errors?.start_date}>
              <FormLabel>Start date:</FormLabel>
              <Input
                type="date"
                max={endDate}
                {...register("start_date", { required: "This field is required" })}
              />
              <FormErrorMessage>{errors?.start_date?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              isDisabled={!multiDay || !startDate}
              isInvalid={!!errors?.end_date}
            >
              <FormLabel>End date:</FormLabel>
              <Input
                type="date"
                min={startDate}
                max={expiryDate}
                {...register("end_date", {
                  required: multiDay && "This field is required",
                })}
              />
              <FormErrorMessage>{errors?.end_date?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              isDisabled={!startDate || (multiDay && !endDate)}
              isInvalid={!!errors?.expiry_date}
            >
              <FormLabel>Expiry date:</FormLabel>
              <Input
                type="date"
                min={endDate || startDate}
                {...register("expiry_date", { required: "This field is required" })}
              />
              <FormErrorMessage>{errors?.expiry_date?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input {...register("event_url")} />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <FormControl>
            <FormLabel>Template</FormLabel>
            <Select
              disabled={eventTemplatesLoading || !eventTemplatesData}
              {...register("event_template_id")}
            >
              <option value={0}>Standard template</option>
              {eventTemplatesData?.event_templates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <FormControl isInvalid={!!errors?.image || !!fileRejections?.[0]}>
            <FormLabel>
              <HStack>
                <Text as="span">POAP artwork</Text>
                <Tooltip
                  label="You can't edit image after POAP creation!"
                  shouldWrapChildren
                >
                  <WarningCircle />
                </Tooltip>
              </HStack>
            </FormLabel>
            <Button
              {...getRootProps()}
              as="label"
              leftIcon={<File />}
              h={10}
              w="full"
              maxW={56}
            >
              <input {...getInputProps()} hidden />
              <Text as="span" display="block" maxW={44} isTruncated>
                {isDragActive
                  ? "Drop the file here"
                  : acceptedFiles?.[0]?.name || "Choose image"}
              </Text>
            </Button>
            <FormHelperText>In PNG format</FormHelperText>
            <FormErrorMessage>
              {errors?.image?.message || fileRejections?.[0]?.errors?.[0]?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <FormControl isInvalid={!!errors?.secret_code}>
            <FormLabel>
              <HStack>
                <Text as="span">Edit code</Text>
                <Tooltip
                  label="Be sure to save the 6 digit Edit Code to make any further updateTemplates"
                  shouldWrapChildren
                >
                  <Question />
                </Tooltip>
              </HStack>
            </FormLabel>
            <Input
              {...register("secret_code", {
                required: "This field is required.",
              })}
            />
            <FormErrorMessage>{errors?.secret_code?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <FormControl isInvalid={!!errors?.email}>
            <FormLabel>Your e-mail address:</FormLabel>
            <Input {...register("email", { required: "This field is required." })} />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <FormControl isInvalid={!!errors?.requested_codes}>
            <FormLabel>
              <HStack>
                <Text as="span">How many mint links do you need?</Text>
                <Tooltip
                  label="
              Request the amount of codes you will need for this drop"
                  shouldWrapChildren
                >
                  <Question />
                </Tooltip>
              </HStack>
            </FormLabel>

            <Controller
              name="requested_codes"
              control={control}
              defaultValue={0}
              rules={{
                required: "This field is required.",
                min: {
                  value: 0,
                  message: "Must be positive",
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumberInput
                  ref={ref}
                  value={value ?? undefined}
                  defaultValue={0}
                  onChange={onChange}
                  onBlur={onBlur}
                  min={0}
                >
                  <NumberInputField placeholder="Mint links" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />

            <FormErrorMessage>{errors?.requested_codes?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Drop type</FormLabel>
            <Controller
              name="private_event"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Checkbox
                  ref={ref}
                  onChange={(e) => onChange(e?.target?.checked)}
                  onBlur={onBlur}
                  checked={value}
                >
                  Private drop
                </Checkbox>
              )}
            />
            <FormHelperText>
              If this is a test drop, please make your drop private.
            </FormHelperText>
          </FormControl>
        </GridItem>
      </Grid>
      <Flex justifyContent="end">
        <Button
          colorScheme="indigo"
          onClick={handleSubmit(onSubmit, console.log)}
          isDisabled={isCreatePoapLoading || isSavePoapLoading}
          isLoading={isCreatePoapLoading || isSavePoapLoading}
        >
          Create POAP
        </Button>
      </Flex>

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default CreatePoapForm
