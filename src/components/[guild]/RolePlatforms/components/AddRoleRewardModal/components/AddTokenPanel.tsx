import {
  Box,
  Checkbox,
  Circle,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { ArrowRight } from "phosphor-react"
import { AddRewardPanelProps } from "platforms/rewards"
import { useState } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"
import { PlatformType } from "types"
import ExistingPointsTypeSelect from "./AddPointsPanel/components/ExistingPointsTypeSelect"

export type AddGatherFormType = {
  gatherApiKey: string
  gatherSpaceId: string
  gatherRole: string
  gatherAffiliation: string
}

const SetTokenStep = ({ onContinue }: { onContinue: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const address = useWatch({ name: `address` })

  return (
    <>
      <ChainPicker controlName="chain" showDivider={false} />

      <TokenPicker
        chain={chain}
        fieldName={`address`}
        rules={{ required: "This field is required" }}
      />

      <Flex justifyContent={"flex-end"} mt="4">
        <Button isDisabled={false} colorScheme="green" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </>
  )
}

const PoolStep = ({ onContinue }: { onContinue: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const address = useWatch({ name: `address` })

  const {
    data: { name: tokenName, symbol: tokenSymbol, logoURI: tokenLogo },
    isValidating: isTokenSymbolValidating,
    error: tokenDataError,
  } = useTokenData(chain, address)

  return (
    <>
      <Text colorScheme="gray">
        Supply the tokens users will receive their eligible amount from. You'll be
        able to deposit more and withdraw from any time.
      </Text>

      <FormControl>
        <FormLabel>Amount to deposit</FormLabel>
        <InputGroup>
          <InputLeftElement>
            <OptionImage img={tokenLogo} alt={chain} />
          </InputLeftElement>

          <NumberInput w="full">
            <NumberInputField pl="10" pr={0} />
            <NumberInputStepper padding={"0 !important"}>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
      </FormControl>

      <HStack w="full" justifyContent={"left"} spacing={3}>
        <Text fontWeight="semibold" colorScheme="gray">
          or
        </Text>
        <Checkbox spacing={1.5}></Checkbox>
        <Text fontWeight="medium" colorScheme="gray">
          add rewards later
        </Text>
      </HStack>

      <Flex justifyContent={"flex-end"} mt="4">
        <Button isDisabled={false} colorScheme="green" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </>
  )
}

const TokenAmountStep = ({ onContinue }: { onContinue: () => void }) => {
  const [value, setValue] = useState("static")

  const options = [
    {
      label: "Static amount",
      value: "static",
    },
    {
      label: "Dynamic amount",
      value: "dynamic",
    },
  ]

  return (
    <>
      <RadioButtonGroup
        options={options}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        chakraStyles={{
          spacing: 1.5,
          size: "sm",
          width: "full",
        }}
      />

      <DynamicAmount />

      <Flex justifyContent={"flex-end"} mt="4">
        <Button isDisabled={false} colorScheme="green" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </>
  )
}

const DynamicAmount = () => {
  const { id, guildPlatforms } = useGuild()

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const { control } = useFormContext()

  const chain = useWatch({ name: `chain`, control })
  const address = useWatch({ name: `address`, control })

  const selectedExistingId = useWatch({
    control,
    name: "data.guildPlatformId",
  })

  const {
    data: { name: tokenName, symbol: tokenSymbol, logoURI: tokenLogo },
    isValidating: isTokenSymbolValidating,
    error: tokenDataError,
  } = useTokenData(chain, address)

  return (
    <>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        Claimable amount is dynamic based on the users’ assets.
      </Text>

      <FormControl>
        <FormLabel mb={0}>Reward amount basis</FormLabel>

        <FormHelperText>
          The number of tokens a user can claim is determined by the amount of their
          points
        </FormHelperText>
      </FormControl>

      <ExistingPointsTypeSelect
        existingPointsRewards={existingPointsRewards}
        selectedExistingId={selectedExistingId}
      />

      <FormLabel>Conversion</FormLabel>
      <HStack w={"full"} mt={3}>
        <NumberInput w="full">
          <NumberInputField placeholder={"0 " + tokenSymbol} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Circle background={"whiteAlpha.200"} p="1">
          <ArrowRight size={12} color="grayText" />
        </Circle>

        <InputGroup>
          <InputLeftElement>
            <OptionImage img={tokenLogo} alt={chain} />
          </InputLeftElement>

          <NumberInput w="full" isReadOnly={true} value={0}>
            <NumberInputField
              pl="10"
              pr={0}
              background={"transparent"}
              _hover={{ cursor: "default" }}
            />
            <NumberInputStepper padding={"0 !important"}>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
      </HStack>
    </>
  )
}

const AddTokenPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<AddGatherFormType>({
    mode: "all",
  })

  const {
    control,
    formState: { errors },
  } = methods

  const steps = [
    { title: "Set token", content: SetTokenStep },
    { title: "Set claimable amount", content: TokenAmountStep },
    { title: "Fund reward pool", content: PoolStep },
  ]

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  return (
    <FormProvider {...methods}>
      <Stepper index={activeStep} orientation="vertical" gap="0" w="full">
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={activeStep != index ? () => setActiveStep(index) : null}
          >
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box w="full">
              <StepTitle>{step.title}</StepTitle>

              {activeStep === index && <step.content onContinue={goToNext} />}
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </FormProvider>
  )
}

export default AddTokenPanel
