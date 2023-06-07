import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useFormState } from "react-hook-form"
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

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.collection}
      >
        <FormLabel>Collection</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.data.collection`}
          rules={{ required: "This field is required." }}
          options={collections}
          isLoading={isLoading}
          isClearable
        />

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
