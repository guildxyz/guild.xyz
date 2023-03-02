import {
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Link,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ArrowSquareOut } from "phosphor-react"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import PolygonIdProofAge from "./PolygonIdProofAge"

const PolygonIdQuery = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors, touchedFields },
  } = useFormContext()

  return (
    <Stack spacing={4}>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.query}
      >
        <FormLabel>Query:</FormLabel>

        <Controller
          control={control}
          name={`${baseFieldPath}.data.query` as const}
          rules={{
            validate: {
              isObject: (value) =>
                typeof value === "object" ||
                "Invalid JSON. Please paste it to a validator to find out more!",
              isArray: (value) =>
                Array.isArray(value) ||
                "The value should be an array of request objects. You should probably just wrap it in a []",
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
              value={tryStringifyJSON(textareaValue)}
              onChange={(e) => {
                const value = e.target.value
                const json = tryParseJSON(value)
                onChange(json || value)
              }}
              onBlur={onBlur}
            />
          )}
        />
        <FormHelperText>
          <Link
            href="https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/"
            isExternal
          >
            <Text fontSize="sm">Docs</Text>
            <Icon ml={1} as={ArrowSquareOut} />
          </Link>
        </FormHelperText>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.query?.message}
        </FormErrorMessage>
      </FormControl>
      <PolygonIdProofAge baseFieldPath={baseFieldPath} />
    </Stack>
  )
}

function tryParseJSON(jsonString) {
  try {
    const o = JSON.parse(jsonString)

    if (o && typeof o === "object") {
      return o
    }
  } catch (e) {}

  return false
}

function tryStringifyJSON(jsonObject) {
  try {
    if (!jsonObject) return ""

    if (typeof jsonObject !== "object") return jsonObject

    return JSON.stringify(jsonObject, null, 2)
  } catch (e) {}

  return ""
}

export default PolygonIdQuery
