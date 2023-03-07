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
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { Image, Question, WarningCircle } from "phosphor-react"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { CreatePoapForm as CreatePoapFormType } from "types"
import RequestsMintLinks from "../RequestMintLinks"

const IMAGE_SIZE = 32

const PoapDataForm = ({ isCreate = false }): JSX.Element => {
  const {
    control,
    register,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext<CreatePoapFormType>()

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
    register("image", { required: isCreate && "This field is required." })
  }, [register])

  const image = useWatch({ control, name: "image" })
  const [base64Image, setBase64Image] = useState(null)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSizeMb: 4,
    accept: { "image/*": [".gif", ".png"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("image", accepted[0], { shouldValidate: true })
        setBase64Image(URL.createObjectURL(accepted[0]))
      }
    },
  })

  return (
    <Stack spacing="6" {...(!isCreate ? {} : getRootProps())}>
      <Grid gap="6" templateColumns={{ md: "auto 1fr" }}>
        <FormControl
          w={IMAGE_SIZE}
          justifySelf="center"
          textAlign="left"
          isInvalid={!!errors?.image || !!fileRejections?.[0]}
          isRequired
          isDisabled={!isCreate}
        >
          <HStack
            alignItems="start"
            spacing={0}
            justifyContent={{ base: "center", md: "start" }}
          >
            <FormLabel>Artwork</FormLabel>
            {isCreate && (
              <Tooltip
                label="You can't edit image after POAP creation!"
                shouldWrapChildren
              >
                <Icon as={WarningCircle} position="relative" top={0.5} left={-2} />
              </Tooltip>
            )}
          </HStack>

          <Circle
            size={IMAGE_SIZE}
            overflow="hidden"
            borderWidth={1}
            bg={"blackAlpha.100"}
            {...(isCreate
              ? {
                  as: "label",
                  transition: "background .2s",
                  _hover: { bg: "whiteAlpha.100" },
                  cursor: "pointer",
                }
              : { cursor: "not-allowed", opacity: 0.4 })}
          >
            <input {...(!isCreate ? {} : getInputProps())} hidden />
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
            ) : base64Image || image ? (
              <Img
                src={base64Image || image}
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
            <Input {...register("name", { required: "This field is required." })} />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <FormControl
              isInvalid={!!errors?.start_date}
              isRequired
              isDisabled={!isCreate}
            >
              <FormLabel>Event date:</FormLabel>
              <Input
                type="date"
                isDisabled={!isCreate}
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

      <Stack direction={{ base: "column", md: "row" }} spacing="4">
        <FormControl isInvalid={!!errors?.requested_codes} isRequired={isCreate}>
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
          {isCreate ? (
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
        {isCreate ? (
          <FormControl isInvalid={!!errors?.email} isRequired>
            <FormLabel>Your e-mail address to recieve links to:</FormLabel>
            <Input
              isDisabled={!isCreate}
              {...register("email", {
                required: isCreate ? "This field is required." : false,
              })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
        ) : (
          <FormControl isInvalid={!!errors?.secret_code} isRequired>
            <HStack alignItems="start" spacing={0}>
              <FormLabel>Edit code</FormLabel>
              <Tooltip
                label="Please paste the edit code you've got in email after the POAP creation to update the POAP"
                shouldWrapChildren
              >
                <Icon as={Question} position="relative" top={0.5} left={-2} />
              </Tooltip>
            </HStack>
            <Input
              {...register("secret_code", {
                required: "This field is required.",
              })}
            />
            <FormErrorMessage>{errors?.secret_code?.message}</FormErrorMessage>
          </FormControl>
        )}
      </Stack>

      {isCreate && (
        <FormControl textAlign="left">
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
      )}
    </Stack>
  )
}

export default PoapDataForm
