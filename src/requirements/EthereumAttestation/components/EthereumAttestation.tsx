import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Chain } from "connectors"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import { EAS_SCAN_BASE } from "../EthereumAttestationRequirement"

const HEX_STRING_REGEX = /^0x[A-F0-9]+$/i
const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const EthereumAttestation = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const key = useWatch({ name: `${baseFieldPath}.data.key` })
  const type = useWatch({ name: `${baseFieldPath}.type` })

  return (
    <>
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={Object.keys(EAS_SCAN_BASE) as Chain[]}
      />

      <FormControl
        isRequired
        isInvalid={
          !!parseFromObject(errors, baseFieldPath)?.data?.[
            type === "EAS_ATTESTED_BY" ? "attester" : "recipient"
          ]
        }
      >
        <FormLabel>
          {type === "EAS_ATTESTED_BY" ? "Attester" : "Recipient"}
        </FormLabel>

        <Input
          {...register(
            `${baseFieldPath}.data.${
              type === "EAS_ATTESTED_BY" ? "attester" : "recipient"
            }`,
            {
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
            }
          )}
        />

        <FormErrorMessage>
          {
            parseFromObject(errors, baseFieldPath)?.data?.[
              type === "EAS_ATTESTED_BY" ? "attester" : "recipient"
            ]?.message
          }
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.schemaId}
      >
        <FormLabel>Schema ID</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.schemaId`, {
            required: "This field is required.",
            pattern: {
              value: HEX_STRING_REGEX,
              message: "Please input a 0x-prefixed hexadecimal schema id.",
            },
          })}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.schemaId?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.key}>
        <FormLabel>Key</FormLabel>

        <Input {...register(`${baseFieldPath}.data.key`)} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.key?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired={key?.length > 0}
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.val}
      >
        <FormLabel>Value</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.val`, {
            required: key?.length > 0 ? "This field is required" : undefined,
          })}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.val?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default EthereumAttestation
