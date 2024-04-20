import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import { Chain } from "wagmiConfig/chains"
import useSismoBadges, { SismoBadgeChain } from "./hooks/useSismoBadges"

const sismoContracts: Record<SismoBadgeChain, string> = {
  POLYGON: "0xf12494e3545d49616d9dfb78e5907e9078618a34",
  GNOSIS: "0xa67f1c6c96cb5dd6ef24b07a77893693c210d846",
  GOERLI: "0xa251eb9be4e7e2bb382268ecdd0a5fca0a962e6c",
}

export const DEPRECATED_PLAYGROUND_ADDRESS =
  "0x71a7089c56dff528f330bc0116c0917cd05b51fc"

const SismoForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })
  const isPlayground = address === DEPRECATED_PLAYGROUND_ADDRESS
  const badgeId = useWatch({ name: `${baseFieldPath}.data.id` })
  const { data, isValidating } = useSismoBadges(chain, isPlayground)

  const pickedBadge = data?.find((option) => option.value === badgeId)

  if (isPlayground)
    return (
      <Alert status="info" mb="6" pb="5">
        <AlertIcon />
        <AlertDescription
          fontWeight="semibold"
          w="full"
          fontSize={{ base: "sm", sm: "md" }}
        >
          Playground badges are deprecated. This requirement will keep working fine,
          but you can't edit it.
        </AlertDescription>
      </Alert>
    )

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain`}
        supportedChains={Object.keys(sismoContracts) as Chain[]}
        onChange={() => {
          setValue(`${baseFieldPath}.data.id`, null)
          if (!isPlayground) {
            setValue(`${baseFieldPath}.address`, sismoContracts[chain])
          }
        }}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
        isDisabled={isValidating}
      >
        <FormLabel>Badge</FormLabel>

        <InputGroup>
          {pickedBadge && (
            <InputLeftElement>
              <OptionImage img={pickedBadge?.img} alt={pickedBadge?.label} />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{ required: "This field is required." }}
            isClearable
            options={data}
            placeholder="Choose badge"
            isLoading={isValidating}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default SismoForm
