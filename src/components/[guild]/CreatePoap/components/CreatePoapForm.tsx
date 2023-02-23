import {
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
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import useDropzone from "hooks/useDropzone"
import useToast from "hooks/useToast"
import { Image, Question, WarningCircle } from "phosphor-react"
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

const IMAGE_SIZE = 32

const CreatePoapForm = ({ setStep }): JSX.Element => {
  const { poapData, setPoapData } = useCreatePoapContext()
  const toast = useToast()

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

  const { onSubmit: onSavePoapSubmit, isLoading: isSavePoapLoading } = useSavePoap({
    onSuccess: () => setStep("requirements"),
  })

  const { onSubmit: onCreatePoapSubmit, isLoading: isCreatePoapLoading } =
    useCreatePoap({
      onSuccess: (response) => {
        toast({
          status: "success",
          title: "Drop successfully submitted",
          description:
            "The POAP Curation Body will review your POAP, and you'll receive an email with the minting links that you’ll have to upload",
          duration: 6000,
        })
        setPoapData(response)
        onSavePoapSubmit({
          poapId: response?.id,
          fancyId: response?.fancy_id,
          expiryDate: convertPoapExpiryDate(response.expiry_date),
          guildId: id,
        })
      },
    })

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

  return (
    <FormProvider {...methods}>
      <Stack spacing="6" {...(poapData?.id ? {} : getRootProps())}>
        <Grid gap="6" templateColumns={{ md: "auto 1fr" }}>
          <FormControl
            w={IMAGE_SIZE}
            justifySelf="center"
            textAlign="left"
            isInvalid={!!errors?.image || !!fileRejections?.[0]}
            isRequired
            isDisabled={!!poapData?.id}
          >
            <HStack
              alignItems="start"
              spacing={0}
              justifyContent={{ base: "center", md: "start" }}
            >
              <FormLabel>Artwork</FormLabel>
              {!poapData?.id && (
                <Tooltip
                  label="You can't edit image after POAP creation!"
                  shouldWrapChildren
                >
                  <Icon as={WarningCircle} position="relative" top={0.5} left={-2} />
                </Tooltip>
              )}
            </HStack>

            <Circle
              as={poapData?.id ? undefined : "label"}
              size={IMAGE_SIZE}
              overflow="hidden"
              borderWidth={1}
              bg={"blackAlpha.100"}
              transition="background .2s"
              _hover={{ bg: "whiteAlpha.100" }}
              cursor="pointer"
            >
              <input {...(poapData?.id ? {} : getInputProps())} hidden />
              {isDragActive ? (
                <Text
                  textAlign={"center"}
                  fontSize="sm"
                  fontWeight={"semibold"}
                  colorScheme="gray"
                  mb="-1"
                >
                  Drop file here
                </Text>
              ) : poapData?.image_url || base64Image ? (
                <Img
                  src={poapData?.image_url || base64Image}
                  alt="POAP artwork"
                  boxSize={IMAGE_SIZE}
                />
              ) : (
                <Icon as={Image} boxSize="8" />
              )}
            </Circle>
            {/* {!poapData?.image_url && <FormHelperText>PNG or GIF</FormHelperText>} */}
            <FormErrorMessage>
              {errors?.image?.message || fileRejections?.[0]?.errors?.[0]?.message}
            </FormErrorMessage>
          </FormControl>
          <Stack spacing="4">
            <FormControl isRequired isInvalid={!!errors?.name} width="full">
              <FormLabel tabIndex={0}>What are you commemorating?</FormLabel>
              <Input
                {...register("name", { required: "This field is required." })}
              />
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
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
          </Stack>
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
        pt="6"
        mt="auto"
        direction={{ base: "column", sm: "row" }}
        justifyContent="end"
        spacing={2}
      >
        <Button
          colorScheme="green"
          onClick={handleSubmit(
            /* poapData?.id ? onUpdatePoapSubmit :  */ onCreatePoapSubmit
          )}
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
