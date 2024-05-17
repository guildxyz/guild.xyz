import {
  Circle,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuildRewardNftBalanceByUserId from "components/[guild]/collect/hooks/useGuildRewardNftBalanceByUserId"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { Chains } from "wagmiConfig/chains"
import { CollectNftForm, useCollectNftContext } from "../../CollectNftContext"
import useNftRanges from "../hooks/useNftRanges"

const AmountPicker = () => {
  const { chain, nftAddress } = useCollectNftContext()
  const {
    mintableAmountPerUser: mintableAmountPerUserFromContract,
    totalSupply,
    maxSupply,
  } = useNftDetails(chain, nftAddress)
  const { data: balance } = useGuildRewardNftBalanceByUserId({
    nftAddress,
    chainId: Chains[chain],
  })

  const mintableAmountPerUser =
    typeof maxSupply === "bigint" &&
    typeof totalSupply === "bigint" &&
    mintableAmountPerUserFromContract > 0
      ? Math.min(
          Math.max(Number(maxSupply - totalSupply), 0),
          Math.max(
            Number(mintableAmountPerUserFromContract - (balance ?? BigInt(0))),
            0
          ) // Defined a fallback for balance here, so the amount picker works properly for logged out users too
        )
      : 0

  const ranges = useNftRanges()

  const rangeBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const circleBgColor = useColorModeValue("white", "gray.700")
  const circleBorderWidth = useColorModeValue(1, 0)

  const {
    control,
    formState: { errors },
  } = useFormContext<CollectNftForm>()

  const numberInputMax =
    mintableAmountPerUser ||
    (typeof maxSupply === "bigint" &&
    typeof totalSupply === "bigint" &&
    maxSupply !== BigInt(0)
      ? Number(maxSupply - totalSupply)
      : undefined)

  const {
    field: { value: amount, onChange: onAmountChange, ...amountField },
  } = useController({
    control,
    name: "amount",
    defaultValue: 1,
    rules: {
      min: {
        value: 1,
        message: "Only positive numbers are accepted",
      },
      max: !!numberInputMax
        ? {
            value: numberInputMax,
            message: `You can collect up to ${numberInputMax} NFTs`,
          }
        : undefined,
    },
  })

  const [activeRange, setActiveRange] = useState<number | undefined>()

  const debouncedAmount = useDebouncedState(amount, 300)
  useEffect(() => {
    if (!ranges) return

    if (!debouncedAmount) {
      setActiveRange(0)
    } else {
      const rangeIndex = ranges.findIndex(
        (r) => r.min <= debouncedAmount && r.max >= debouncedAmount
      )

      if (rangeIndex === -1 && debouncedAmount > ranges.at(-1).max) {
        setActiveRange(ranges.length - 1)
      } else {
        setActiveRange(rangeIndex)
      }
    }
  }, [ranges, debouncedAmount])

  if (!ranges) return null

  return (
    <Stack w="full">
      <Stack>
        <Text as="span" fontWeight="medium">
          Amount
        </Text>

        {ranges?.at(-1).max >= 10 && (
          <SimpleGrid columns={4} gap={2}>
            {ranges.map((range, index) => {
              const isDisabled =
                (mintableAmountPerUser > 0 && mintableAmountPerUser < range.min) ||
                (maxSupply > 0 && maxSupply - totalSupply < range.min)
              return (
                <Button
                  key={range.name}
                  variant="unstyled"
                  bgColor={rangeBgColor}
                  _hover={{
                    bgColor: isDisabled ? rangeBgColor : undefined,
                  }}
                  py={3}
                  h="auto"
                  isDisabled={isDisabled}
                  onClick={() => {
                    setActiveRange(index)

                    if (ranges[index].min <= amount && ranges[index].max >= amount)
                      return

                    onAmountChange(ranges[index].min)
                  }}
                  borderWidth={2}
                  borderColor={activeRange === index ? undefined : "transparent"}
                  transition="background 0.2s ease, border-color 0.2s ease"
                >
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Circle
                      bgColor={circleBgColor}
                      size={10}
                      borderWidth={circleBorderWidth}
                    >
                      <Text as="span" fontSize="lg">
                        {range.icon}
                      </Text>
                    </Circle>

                    <Stack spacing={0}>
                      <Text as="span" fontSize="xs">
                        {range.name}
                      </Text>

                      <Text as="span" fontSize="xs" colorScheme="gray">
                        {index === ranges.length - 1 &&
                        (mintableAmountPerUserFromContract === BigInt(0) ||
                          mintableAmountPerUserFromContract > range.max)
                          ? `${range.min}+`
                          : range.min === range.max
                          ? range.min
                          : `${range.min} - ${range.max}`}
                      </Text>
                    </Stack>
                  </Stack>
                </Button>
              )
            })}
          </SimpleGrid>
        )}
      </Stack>

      <FormControl isInvalid={!!errors?.amount}>
        <NumberInput
          value={amount}
          onChange={onAmountChange}
          {...amountField}
          min={1}
          max={numberInputMax}
        >
          <NumberInputField placeholder="Custom amount" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default AmountPicker
