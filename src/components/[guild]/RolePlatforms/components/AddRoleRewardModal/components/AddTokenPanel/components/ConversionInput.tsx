import {
  Circle,
  FormLabel,
  HStack,
  IconButton,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { ArrowRight, Lock, LockOpen } from "phosphor-react"
import { ReactNode, useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import ControlledNumberInput from "requirements/WalletActivity/components/ControlledNumberInput"
import { MIN_TOKEN_AMOUNT } from "utils/guildCheckout/constants"

type ConversionForm = {
  tokenAmount: string
  tokenPreview: string
  pointAmount: string
  pointPreview: string
}

type Props = {
  name: string
  fromImage: ReactNode
  toImage: ReactNode
  defaultMultiplier?: number
}

const ConversionInput = ({
  name,
  fromImage,
  toImage,
  defaultMultiplier = 1,
}: Props) => {
  const { control, setValue } = useFormContext()

  const methods = useForm<ConversionForm>({
    mode: "all",
    defaultValues: {
      tokenAmount: "1",
      pointAmount: defaultMultiplier.toString(),
    },
  })

  const { control: subformControl, setValue: setSubformValue } = methods
  const [conversionLocked, setConversionLocked] = useState(false)

  const multiplier = useWatch({ name, control })

  const tokenAmount = useWatch({ name: `tokenAmount`, control: subformControl })
  const pointAmount = useWatch({ name: `pointAmount`, control: subformControl })
  const tokenPreview = useWatch({ name: `tokenPreview`, control: subformControl })
  const pointPreview = useWatch({ name: `pointPreview`, control: subformControl })

  useEffect(() => {
    setValue(name, defaultMultiplier || 1)
  }, [defaultMultiplier, setValue, name])

  const toggleConversionLock = () => {
    if (conversionLocked) {
      setConversionLocked(false)
      setSubformValue("tokenAmount", tokenPreview)
      setSubformValue("pointAmount", pointPreview)
    } else {
      setConversionLocked(true)
      setSubformValue("tokenPreview", tokenAmount)
      setSubformValue("pointPreview", pointAmount)
    }
  }

  const tokenPreviewChange = (valueAsString, valueAsNumber) => {
    if (conversionLocked) {
      const pointPreviewValue = parseFloat(
        (valueAsNumber * multiplier).toFixed(
          MIN_TOKEN_AMOUNT.toString().split(".")[1]?.length || 0
        )
      ).toString()
      setSubformValue("pointPreview", pointPreviewValue)
    }
  }

  const updateConversionRate = (value: string, tokenOrPoint: "token" | "point") => {
    if (conversionLocked) return
    const pointValue = Number(tokenOrPoint === "point" ? value : pointAmount)
    const tokenValue = Number(tokenOrPoint === "token" ? value : tokenAmount)
    setValue("multiplier", pointValue / tokenValue)
  }

  return (
    <FormProvider {...methods}>
      <HStack justifyContent={"space-between"}>
        <FormLabel>Conversion</FormLabel>
        <IconButton
          opacity={conversionLocked ? 1 : 0.5}
          icon={conversionLocked ? <Lock /> : <LockOpen />}
          size={"xs"}
          rounded={"full"}
          variant={"ghost"}
          aria-label="Lock/unlock conversion"
          onClick={toggleConversionLock}
        />
      </HStack>

      <HStack w={"full"}>
        <InputGroup>
          <InputLeftElement>{fromImage}</InputLeftElement>

          {conversionLocked ? (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={tokenPreviewChange}
              name={"tokenPreview"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
            />
          ) : (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={(valString) => updateConversionRate(valString, "token")}
              name={"tokenAmount"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
            />
          )}
        </InputGroup>

        <Circle background={"whiteAlpha.200"} p="1">
          <ArrowRight size={12} color="grayText" />
        </Circle>

        <InputGroup>
          <InputLeftElement>{toImage}</InputLeftElement>
          {conversionLocked ? (
            <ControlledNumberInput
              numberFormat="FLOAT"
              name={"pointPreview"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
              isReadOnly
            />
          ) : (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={(valString) => updateConversionRate(valString, "point")}
              name={"pointAmount"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
            />
          )}
        </InputGroup>
      </HStack>
    </FormProvider>
  )
}

export default ConversionInput
