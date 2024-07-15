import {
  Circle,
  FormLabel,
  HStack,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { PiArrowRight } from "react-icons/pi"
import { PiLock } from "react-icons/pi"
import { PiLockOpen } from "react-icons/pi"
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
  fromText?: string
  toImage: ReactNode
  toText?: string
  defaultMultiplier?: number
}

const ConversionInput = ({
  name,
  fromImage,
  fromText,
  toImage,
  toText,
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
    setValue(name, pointValue / tokenValue)
  }

  return (
    <FormProvider {...methods}>
      <HStack justifyContent={"space-between"}>
        <FormLabel>Conversion</FormLabel>
        <IconButton
          opacity={conversionLocked ? 1 : 0.5}
          icon={conversionLocked ? <PiLock /> : <PiLockOpen />}
          size={"xs"}
          rounded={"full"}
          variant={"ghost"}
          aria-label="PiLock/unlock conversion"
          onClick={toggleConversionLock}
        />
      </HStack>

      <HStack w={"full"}>
        <InputGroup>
          {fromImage && <InputLeftElement>{fromImage}</InputLeftElement>}

          {conversionLocked ? (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={tokenPreviewChange}
              name={"tokenPreview"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: fromImage ? 9 : 4 }}
              min={MIN_TOKEN_AMOUNT}
              w="full"
            />
          ) : (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={(valString) => updateConversionRate(valString, "token")}
              name={"tokenAmount"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: fromImage ? 9 : 4 }}
              min={MIN_TOKEN_AMOUNT}
              w="full"
            />
          )}
          {fromText && <InputUnitElement>{fromText}</InputUnitElement>}
        </InputGroup>

        <Circle background={"whiteAlpha.200"} p="1">
          <PiArrowRight size={12} color="grayText" />
        </Circle>

        <InputGroup>
          {toImage && <InputLeftElement>{toImage}</InputLeftElement>}

          {conversionLocked ? (
            <ControlledNumberInput
              numberFormat="FLOAT"
              name={"pointPreview"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: toImage ? 9 : 4 }}
              min={MIN_TOKEN_AMOUNT}
              isReadOnly
              w="full"
            />
          ) : (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={(valString) => updateConversionRate(valString, "point")}
              name={"pointAmount"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 7, pl: toImage ? 9 : 4 }}
              min={MIN_TOKEN_AMOUNT}
              w="full"
            />
          )}
          {toText && <InputUnitElement>{toText}</InputUnitElement>}
        </InputGroup>
      </HStack>
    </FormProvider>
  )
}

const InputUnitElement = ({ children }: PropsWithChildren<any>) => {
  // adding a bg so it doesn't overlay in case of huge numbers, especially on mobile
  const inputBg = useColorModeValue("white", "#212123")

  return (
    <InputRightElement
      h={`calc(var(--input-height) - 2px)`}
      top="1px"
      right={{ base: "8px", md: "35px" }}
      bg={inputBg}
      width="auto"
      maxWidth={{ base: "50px", md: "70px" }}
    >
      <Text colorScheme={"gray"} fontSize={"xs"} fontWeight={"bold"} noOfLines={2}>
        {children}
      </Text>
    </InputRightElement>
  )
}

export default ConversionInput
