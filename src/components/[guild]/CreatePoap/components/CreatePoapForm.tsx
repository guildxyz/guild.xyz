import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Checkbox,
  Circle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Img,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import useDropzone from "hooks/useDropzone"
import { Calendar, File, Question, WarningCircle } from "phosphor-react"
import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { CreatePoapForm as CreatePoapFormType } from "types"
import convertPoapExpiryDate from "utils/convertPoapExpiryDate"
import useCreatePoap from "../hooks/useCreatePoap"
import useSavePoap from "../hooks/useSavePoap"
import { useCreatePoapContext } from "./CreatePoapContext"
import RequestsMintLinks from "./RequestMintLinks"

const convertPoapDate = (date: string): string => {
  if (!date) return ""

  // Firefox hack
  const [day, month, year] = date.split("-")
  const convertedPoapDate = new Date(`${day}-${month}${year}`)

  const convertedYear = convertedPoapDate.getFullYear()
  const convertedMonth = convertedPoapDate.getMonth() + 1
  const convertedDay = convertedPoapDate.getDate()
  const newExpiryDateValue = `${convertedYear}-${
    (convertedMonth < 10 ? "0" : "") + convertedMonth
  }-${(convertedDay < 10 ? "0" : "") + convertedDay}`

  return newExpiryDateValue
}

const CreatePoapForm = (): JSX.Element => {
  const { nextStep, setIsFormDirty, poapData, setPoapData } = useCreatePoapContext()

  const defaultValues = poapData?.id
    ? {
        ...poapData,
        start_date: convertPoapDate(poapData.start_date),
        end_date: convertPoapDate(poapData.end_date),
        expiry_date: convertPoapDate(poapData.expiry_date),
      }
    : {
        secret_code: Math.floor(100000 + Math.random() * 900000),
        event_template_id: 0,
        virtual_event: true,
        private_event: false,
        city: "",
        country: "",
      }

  const methods = useForm<CreatePoapFormType>({
    mode: "all",
    defaultValues,
  })

  const {
    control,
    register,
    setValue,
    formState: { isDirty, errors, touchedFields },
    handleSubmit,
  } = methods

  const { id, guildPlatforms, poaps } = useGuild()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)

  const startDate = useWatch({ control, name: "start_date" })
  const endDate = useWatch({ control, name: "end_date" })
  const expiryDate = useWatch({ control, name: "expiry_date" })

  useEffect(() => {
    if (expiryDate || !startDate || touchedFields.expiry_date) return

    const startDateAsDate = new Date(startDate)
    const newExpiryDate = new Date(startDateAsDate)
    newExpiryDate.setDate(startDateAsDate.getDate() + 1)

    const year = newExpiryDate.getFullYear()
    const month = newExpiryDate.getMonth() + 1
    const day = newExpiryDate.getDate()
    const newExpiryDateValue = `${year}-${(month < 10 ? "0" : "") + month}-${
      (day < 10 ? "0" : "") + day
    }`

    setValue("expiry_date", newExpiryDateValue)
  }, [touchedFields, startDate, expiryDate])

  useEffect(() => {
    if (!register) return
    register("image", { required: poapData?.id ? false : "This field is required." })
  }, [register])

  const image = useWatch({ control, name: "image" })
  const [base64Image, setBase64Image] = useState(null)

  useEffect(() => {
    if (!image) return
    setBase64Image(URL.createObjectURL(image))
  }, [image])

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

  useEffect(() => {
    if (savePoapResponse) return
    setIsFormDirty(isDirty)
  }, [isDirty])

  useEffect(() => {
    if (!savePoapResponse) return
    setIsFormDirty(false)
  }, [savePoapResponse])

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
      expiryDate: convertPoapExpiryDate(createPoapResponse.expiry_date),
      guildId: id,
    })
  }, [createPoapResponse])

  const {
    isDragActive,
    fileRejections,
    getRootProps,
    getInputProps,
    acceptedFiles,
  } = useDropzone({
    multiple: false,
    maxSizeMb: 4,
    accept: { "image/*": [".gif", ".png"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("image", accepted[0])
      }
    },
  })

  /* TODO: put back edit functionality */

  // const createRoleWithPoap = () =>
  //   onCreateRoleSubmit({
  //     guildId: id,
  //     rolePlatforms: [
  //       {
  //         guildPlatformId: guildPlatforms?.find(
  //           (p) => p.platformId === PlatformType.DISCORD
  //         )?.id,
  //         platformRoleData: {},
  //         platformRoleId: null,
  //       },
  //     ],
  //     logic: "AND",
  //     name: "POAP owner",
  //     description: `A role for ${poapData?.name ?? "POAP"} owners`,
  //     imageUrl: poapData?.image_url ?? `/guildLogos/${getRandomInt(286)}.svg`,
  //     requirements: [
  //       {
  //         type: "POAP",
  //         data: {
  //           id: poapData?.fancy_id,
  //         },
  //       },
  //     ],
  //   })

  // const { onSubmit: onUpdateGuildPoapSubmit, isLoading: isUpdateGuildPoapLoading } =
  //   useUpdateGuildPoap()
  // const { onSubmit: onUpdatePoapSubmit, isLoading: isUpdatePoapLoading } =
  //   useUpdatePoap(() =>
  //     onUpdateGuildPoapSubmit({
  //       id: guildPoap?.id,
  //       expiryDate: expiryDate?.length
  //         ? new Date(expiryDate).getTime() / 1000
  //         : undefined,
  //     })
  //   )

  if (savePoapResponse)
    return (
      <VStack spacing={4}>
        <Alert status="success">
          <AlertIcon />
          <Box>
            <AlertTitle>Drop successfully submitted</AlertTitle>
            <AlertDescription>
              <Text>
                The POAP Curation Body will review your petition according to the
                POAP drop policies and you'll receive a confirmation email with the
                minting links that you’ll have to upload
              </Text>
            </AlertDescription>
          </Box>
        </Alert>
        <Card p={4} flexDirection="row" alignItems="center" w="full">
          <SkeletonCircle boxSize={24} mr="4" isLoaded={!!poapData?.image_url}>
            <Img
              src={poapData?.image_url}
              alt={poapData?.name}
              boxSize={24}
              rounded="full"
            />
          </SkeletonCircle>
          <VStack alignItems="start">
            <Skeleton isLoaded={!!poapData}>
              <Text fontFamily="display" fontWeight="bold">
                {poapData
                  ? `#${poapData?.id} - ${poapData?.name}`
                  : "#0 - Unknown POAP"}
              </Text>
            </Skeleton>

            <Skeleton isLoaded={!!poapData}>
              <HStack>
                <Icon as={Calendar} />
                <Text>{poapData?.start_date || "Unknown date"}</Text>
              </HStack>
            </Skeleton>
          </VStack>
        </Card>
      </VStack>
    )

  return (
    <FormProvider {...methods}>
      <Stack mb={12} spacing="6">
        <Grid gap="4" templateColumns={{ md: "auto 1fr" }}>
          <FormControl
            textAlign="left"
            isInvalid={!!errors?.image || !!fileRejections?.[0]}
            isRequired
            isDisabled={!!poapData?.id}
          >
            <HStack alignItems="start" spacing={0}>
              <FormLabel>POAP artwork</FormLabel>
              {!poapData?.id && (
                <Tooltip
                  label="You can't edit image after POAP creation!"
                  shouldWrapChildren
                >
                  <Icon as={WarningCircle} position="relative" top={0.5} left={-2} />
                </Tooltip>
              )}
            </HStack>

            <HStack>
              {(poapData?.image_url || base64Image) && (
                <Circle size={10} overflow="hidden" borderWidth={1}>
                  <Img
                    src={poapData?.image_url || base64Image}
                    alt="POAP artwork"
                    boxSize={10}
                  />
                </Circle>
              )}
              <Tooltip
                isDisabled={!poapData?.id}
                label="You can't edit image after POAP creation!"
                shouldWrapChildren
              >
                <Button
                  {...(poapData?.id ? {} : getRootProps())}
                  as={poapData?.id ? undefined : "label"}
                  leftIcon={<File />}
                  h={10}
                  w="full"
                  isDisabled={!!poapData?.id}
                >
                  <input {...(poapData?.id ? {} : getInputProps())} hidden />
                  <Text
                    as="span"
                    maxW={{ base: 44, md: 28 }}
                    noOfLines={1}
                    sx={{
                      display: "block",
                    }}
                  >
                    {isDragActive
                      ? "Drop the file here"
                      : acceptedFiles?.[0]?.name || "Choose image"}
                  </Text>
                </Button>
              </Tooltip>
            </HStack>
            {!poapData?.image_url && (
              <FormHelperText>In PNG or GIF format</FormHelperText>
            )}
            <FormErrorMessage>
              {errors?.image?.message || fileRejections?.[0]?.errors?.[0]?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors?.name} width="full">
            <FormLabel tabIndex={0}>What are you commemorating?</FormLabel>
            <Input {...register("name", { required: "This field is required." })} />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
        </Grid>

        <FormControl isRequired isInvalid={!!errors?.description}>
          <FormLabel>What do you want people to remember about this drop?</FormLabel>
          <Textarea
            {...register("description", {
              required: "This field is required.",
              maxLength: {
                value: 1500,
                message: "Description length should be maximum 1500 characters",
              },
            })}
            className="custom-scrollbar"
            minH={32}
            placeholder="Explain what this POAP is about, including how the POAP will be distributed. This text is stored on the NFT metadata and displayed in the POAP mobile app and all across the POAP ecosystem. Drops in languages other than English still have to provide an English description."
          />
          <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
        </FormControl>

        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <FormControl
            isInvalid={!!errors?.start_date}
            isRequired
            isDisabled={!!poapData?.id}
          >
            <FormLabel>Event date:</FormLabel>
            <Input
              type="date"
              max={endDate}
              {...register("start_date", {
                required: "This field is required",
              })}
            />
            <FormErrorMessage>{errors?.start_date?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            isDisabled={!startDate}
            isInvalid={!!errors?.expiry_date}
            isRequired
          >
            <FormLabel>POAP expiry date:</FormLabel>
            <Input
              type="date"
              min={startDate}
              {...register("expiry_date", {
                required: "This field is required",
                validate: (value) =>
                  value !== startDate || "Shouldn't be the same as start date.",
              })}
            />
            <FormErrorMessage>{errors?.expiry_date?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        {/* <FormControl>
          <FormLabel>Website</FormLabel>
          <Input {...register("event_url")} />
        </FormControl> */}

        {/* <FormControl isInvalid={!!errors?.secret_code} isRequired>
          <HStack alignItems="start" spacing={0}>
            <FormLabel>Edit code</FormLabel>
            {!poapData?.id && (
              <Tooltip
                label="Be sure to save the 6 digit Edit Code to make any further updates"
                shouldWrapChildren
              >
                <Icon as={Question} position="relative" top={0.5} left={-2} />
              </Tooltip>
            )}
          </HStack>
          <Input
            {...register("secret_code", {
              required: "This field is required.",
            })}
          />
          <FormErrorMessage>{errors?.secret_code?.message}</FormErrorMessage>
        </FormControl> */}

        <Stack direction={{ base: "column", md: "row" }} spacing="4">
          <FormControl
            isInvalid={!!errors?.requested_codes}
            isRequired={!poapData?.id}
          >
            <HStack alignItems="start" spacing={0}>
              <FormLabel>How many mint links do you need?</FormLabel>
              <Tooltip
                label="
          Request the amount of codes you will need for this drop"
                shouldWrapChildren
              >
                <Icon as={Question} position="relative" top={0.5} left={-2} />
              </Tooltip>
            </HStack>
            {!poapData?.id ? (
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
            ) : (
              <RequestsMintLinks />
            )}
            <FormErrorMessage>{errors?.requested_codes?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={!!errors?.email}
            isRequired={!poapData?.id}
            isDisabled={!!poapData?.id}
          >
            <FormLabel>Your e-mail address to recieve links to:</FormLabel>
            <Input
              {...register("email", {
                required: !poapData?.id ? "This field is required." : false,
              })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <FormControl textAlign="left" isDisabled={!!poapData?.id}>
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
      </Stack>
      <Stack
        direction={{ base: "column", sm: "row" }}
        justifyContent="end"
        spacing={2}
      >
        <Button
          colorScheme="green"
          onClick={handleSubmit(/* poapData?.id ? onUpdatePoapSubmit :  */ onSubmit)}
          isDisabled={
            isCreatePoapLoading || isSavePoapLoading /*  ||
            isUpdatePoapLoading ||
            isUpdateGuildPoapLoading */
          }
          isLoading={
            isCreatePoapLoading || isSavePoapLoading /*  ||
            isUpdatePoapLoading ||
            isUpdateGuildPoapLoading */
          }
          loadingText={`${poapData?.id ? "Updating" : "Creating"} POAP`}
        >
          {poapData?.id ? "Update POAP" : "Create POAP"}
        </Button>
      </Stack>

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default CreatePoapForm
