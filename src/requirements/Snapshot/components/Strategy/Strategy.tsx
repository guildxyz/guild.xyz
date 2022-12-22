import {
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Chain, supportedChains } from "connectors"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import SpaceSelect from "../SpaceSelect"
import SingleStrategy from "./components/SingleStrategy"

const unsupportedChains: Chain[] = ["RINKEBY", "NOVA"]

const Strategy = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <ChainPicker
        controlName={`${baseFieldPath}.chain`}
        supportedChains={supportedChains.filter(
          (c) => !unsupportedChains.includes(c)
        )}
        showDivider={false}
      />
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.block}
      >
        <HStack mb="2">
          <FormLabel m="0">Block number</FormLabel>
          <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
            {`- or `}
          </Text>
          <Checkbox
            flexGrow={0}
            fontWeight="normal"
            size="sm"
            spacing={1}
            isChecked={getValues(`${baseFieldPath}.data.block`) === "latest"}
            onChange={(e) => {
              clearErrors(`${baseFieldPath}.data.block`)
              setValue(
                `${baseFieldPath}.data.block`,
                e.target.checked ? "latest" : ""
              )
            }}
            isInvalid={false}
          >
            Use latest block
          </Checkbox>
        </HStack>

        <Controller
          name={`${baseFieldPath}.data.block` as const}
          control={control}
          rules={{
            required: "This field is required.",
            min: {
              value: 0,
              message: "Must be a positive number",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              isDisabled={getValues(`${baseFieldPath}.data.block`) === "latest"}
              ref={ref}
              value={typeof value === "number" ? value : ""}
              onChange={(newValue) => {
                const parsedValue = parseInt(newValue)
                onChange(isNaN(parsedValue) ? "" : parsedValue)
              }}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField
                placeholder={
                  getValues(`${baseFieldPath}.data.block`) === "latest"
                    ? "Latest"
                    : undefined
                }
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.block?.message}
        </FormErrorMessage>
      </FormControl>
      <Divider />
      <SingleStrategy index={0} baseFieldPath={baseFieldPath} />

      <SpaceSelect
        optional
        baseFieldPath={baseFieldPath}
        helperText="Only needed for delegation strategies"
      />
    </>
  )
}

export default Strategy
