import {
  Circle,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { ArrowRight, Lock, LockOpen } from "phosphor-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import ControlledNumberInput from "requirements/WalletActivity/components/ControlledNumberInput"
import Star from "static/icons/star.svg"
import Token from "static/icons/token.svg"
import { MIN_TOKEN_AMOUNT } from "utils/guildCheckout/constants"

type ConversionForm = {
  tokenAmount: string
  tokenPreview: string
  pointAmount: string
  pointPreview: string
}

const ConversionInput = ({ defaultValue }: { defaultValue?: string }) => {
  const { control, setValue } = useFormContext()

  const methods = useForm<ConversionForm>({
    mode: "all",
    defaultValues: {
      tokenAmount: "1",
      pointAmount: defaultValue || "1",
    },
  })

  const { control: subformControl, setValue: setSubformValue } = methods

  const [conversionLocked, setConversionLocked] = useState(false)

  const pointsPlatforms = useAccessedGuildPoints()
  const pointsPlatformId = useWatch({ name: "data.guildPlatformId", control })
  const imageUrl = useWatch({ name: `imageUrl`, control })
  const chain = useWatch({ name: `chain`, control })
  const address = useWatch({ name: `tokenAddress`, control })
  const multiplier = useWatch({ name: `multiplier`, control })

  const tokenAmount = useWatch({ name: `tokenAmount`, control: subformControl })
  const pointAmount = useWatch({ name: `pointAmount`, control: subformControl })
  const tokenPreview = useWatch({ name: `tokenPreview`, control: subformControl })
  const pointPreview = useWatch({ name: `pointPreview`, control: subformControl })

  useEffect(() => {
    setValue("multiplier", Number(defaultValue) || 1)
  }, [defaultValue, setValue])

  const selectedPointsPlatform = pointsPlatforms.find(
    (gp) => gp.id === pointsPlatformId
  )
  const {
    data: { logoURI: tokenLogo },
  } = useTokenData(chain, address)

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
          <InputLeftElement>
            {selectedPointsPlatform?.platformGuildData?.imageUrl ? (
              <OptionImage
                img={selectedPointsPlatform?.platformGuildData?.imageUrl}
                alt={
                  selectedPointsPlatform?.platformGuildData?.name ??
                  "Point type image"
                }
              />
            ) : (
              <Icon as={Star} />
            )}
          </InputLeftElement>

          {conversionLocked ? (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={tokenPreviewChange}
              name={"tokenPreview"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 0, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
            />
          ) : (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={(valString) => updateConversionRate(valString, "token")}
              name={"tokenAmount"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 0, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
            />
          )}
        </InputGroup>

        <Circle background={"whiteAlpha.200"} p="1">
          <ArrowRight size={12} color="grayText" />
        </Circle>

        <InputGroup>
          <InputLeftElement>
            {tokenLogo || imageUrl ? (
              <OptionImage img={tokenLogo ?? imageUrl} alt={chain} />
            ) : (
              <Token />
            )}
          </InputLeftElement>

          {conversionLocked ? (
            <ControlledNumberInput
              numberFormat="FLOAT"
              name={"pointPreview"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 0, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
              isReadOnly
            />
          ) : (
            <ControlledNumberInput
              numberFormat="FLOAT"
              onChange={(valString) => updateConversionRate(valString, "point")}
              name={"pointAmount"}
              adaptiveStepSize
              numberInputFieldProps={{ pr: 0, pl: 10 }}
              min={MIN_TOKEN_AMOUNT}
            />
          )}
        </InputGroup>
      </HStack>
    </FormProvider>
  )
}

export default ConversionInput
