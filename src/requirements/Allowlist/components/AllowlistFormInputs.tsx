import {
  Checkbox,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { isValidAddress } from "components/[guild]/EditGuild/components/Admins/Admins"
import JoinStepIndicator from "components/[guild]/JoinModal/components/JoinStepIndicator"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { usePinataWithProgress } from "hooks/usePinata/usePinata"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import { File } from "phosphor-react"
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import { z } from "zod"

const MAX_IPFS_FILE_SIZE_MB = 100

function validateEmailAllowlist(toValidate: string[]) {
  if (!toValidate) return

  const containsEmpty = toValidate.some((address) => address === "")

  if (containsEmpty) {
    return "Field contains empty line"
  }

  const invalidEmails = toValidate.filter(
    (address) => !z.string().email().safeParse(address).success
  )

  if (invalidEmails.length > 0) {
    return `Field contains invalid email address: ${invalidEmails[0]}`
  }
}

export default function AllowlistFormInputs({
  baseFieldPath,
}: {
  baseFieldPath: string
}) {
  const {
    setValue,
    formState: { errors },
    control,
    register,
  } = useFormContext()
  const router = useRouter()

  const isHidden = useWatch({ name: `${baseFieldPath}.data.hideAllowlist` })

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/*": [".csv", ".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) parseFile.onSubmit(accepted[0])
    },
    maxSizeMb: MAX_IPFS_FILE_SIZE_MB,
  })

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const ipfsHash = useWatch({ name: `${baseFieldPath}.data.ipfsHash` })
  const [uploadedLength, setUploadedLength] = useState<number>()

  const { onUpload, progress } = usePinataWithProgress()

  const parseFile = useSubmit(
    (file: File) =>
      new Promise<void>((resolve, reject) => {
        setUploadedLength(null)
        const fileReader = new FileReader()

        fileReader.onload = () => {
          const lines = fileReader.result
            ?.toString()
            ?.split("\n")
            ?.filter((line) => !!line)
            ?.map((line) => line.trim())

          onUpload({
            data: [JSON.stringify(lines)],
            fileNames: ["allowlist.json"],
          })
            .then(({ IpfsHash }) => {
              setUploadedLength(lines.length)
              setValue(`${baseFieldPath}.data.ipfsHash`, IpfsHash)
              setValue(`${baseFieldPath}.data.addresses`, [], {
                shouldDirty: true,
                shouldValidate: true,
              })
            })
            .then(() => resolve())
            .catch(() => {
              reject(new Error("Failed to upload file to IPFS"))
            })
        }

        fileReader.onerror = () => reject(new Error("Failed to read file"))

        fileReader.readAsText(file)
      })
  )

  return (
    <Stack spacing={4} alignItems="start" {...getRootProps()}>
      <FormControl isInvalid={!!fileRejections?.[0]} textAlign="left">
        <FormLabel>Upload from file</FormLabel>

        <Button
          as="label"
          leftIcon={<File />}
          h={10}
          maxW={56}
          cursor="pointer"
          isLoading={parseFile.isLoading}
          loadingText={"Uploading"}
          spinner={
            <JoinStepIndicator
              status={progress === 0 ? "LOADING" : "PROGRESS"}
              progress={progress * 100}
            />
          }
        >
          <input {...getInputProps()} hidden />
          <Text as="span" display="block" maxW={44} noOfLines={1}>
            {isDragActive ? "Drop the file here" : "Choose .txt/.csv"}
          </Text>
        </Button>

        <Collapse in={typeof uploadedLength === "number"}>
          <FormHelperText>Uploaded {uploadedLength} addresses</FormHelperText>
        </Collapse>

        <FormErrorMessage>
          {fileRejections?.[0]?.errors?.[0]?.message}
        </FormErrorMessage>
      </FormControl>

      <Collapse in={!ipfsHash && !parseFile.isLoading}>
        <FormControl
          isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.addresses}
        >
          <Controller
            control={control}
            name={`${baseFieldPath}.data.addresses` as const}
            rules={{
              validate:
                type === "ALLOWLIST_EMAIL"
                  ? validateEmailAllowlist
                  : (value_) => {
                      if (!value_) return

                      const validAddresses = value_.filter(
                        (address) => address !== "" && isValidAddress(address)
                      )
                      // for useBalancy
                      setValue(
                        `${baseFieldPath}.data.validAddresses`,
                        validAddresses
                      )

                      if (validAddresses.length !== value_.length)
                        return "Field contains invalid addresses"

                      if (router.route !== "/balancy" && value_.length > 50000)
                        return `You've added ${value_.length} addresses but the maximum is 50000`
                    },
            }}
            render={({ field: { onChange, onBlur, value: textareaValue, ref } }) => (
              <Textarea
                ref={ref}
                resize="vertical"
                p={2}
                minH={64}
                className="custom-scrollbar"
                cols={42}
                wrap="off"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={textareaValue?.join("\n") || ""}
                onChange={(e) => onChange(e.target.value?.split("\n"))}
                onBlur={onBlur}
                placeholder="...or paste addresses, each one in a new line"
              />
            )}
          />
          <FormErrorMessage>
            {
              (parseFromObject(errors, baseFieldPath)?.data?.addresses as any)
                ?.message
            }
          </FormErrorMessage>
        </FormControl>
      </Collapse>

      {router.asPath !== "/balancy" && (
        <FormControl pb={3}>
          <Checkbox
            fontWeight="medium"
            {...register(`${baseFieldPath}.data.hideAllowlist`)}
            checked={isHidden}
          >
            Make allowlist private
          </Checkbox>
        </FormControl>
      )}
    </Stack>
  )
}
