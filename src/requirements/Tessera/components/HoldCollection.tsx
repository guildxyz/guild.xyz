import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import useTesseraVaults from "../hooks/useTesseraVaults"
import NumberField from "./NumberField"

const HoldCollection = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const { data, isLoading } = useTesseraVaults()

  const collections = data
    ? data
        .reduce((acc, vault) => {
          vault.collectables?.forEach((collectable) => {
            if (
              !acc.some(
                (collection) => collection.slug === collectable.collection?.slug
              )
            )
              acc.push(collectable.collection)
          })
          return acc
        }, [])
        .map((collection) => ({
          label: collection.name,
          value: collection.slug,
          img: collection.imageUrl,
        }))
    : []

  const collection = useWatch({ name: `${baseFieldPath}.data.collection` })

  const selectedCollection = collections?.find((c) => c.value === collection)

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.collection}
      >
        <FormLabel>Collection</FormLabel>

        <InputGroup>
          {selectedCollection && (
            <InputLeftElement>
              <OptionImage
                img={selectedCollection.img}
                alt={selectedCollection.label}
              />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={`${baseFieldPath}.data.collection`}
            rules={{ required: "This field is required." }}
            options={collections}
            isLoading={isLoading}
            isClearable
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.collection?.message}
        </FormErrorMessage>
      </FormControl>

      <NumberField
        baseFieldPath={baseFieldPath}
        label="Minimum amount"
        fieldName="minAmount"
        min={1}
        isRequired
      />
    </>
  )
}

export default HoldCollection
