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
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import useNftBalance from "hooks/useNftBalance"
import { useEffect, useMemo, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { Chains } from "wagmiConfig/chains"
import { useCollectNftContext } from "../../CollectNftContext"
import { CollectNftForm } from "../CollectNft"

type MintingRange = {
  name: string
  icon: string
  min: number
  max: number
}

/**
 * Notes:
 *
 * - We'll always have 4 different ranges
 * - Infinite is when mintableAmountPerUser = 0, but we don't need to handle that case,
 *   since we won't show this component for that kind of NFTs
 */
const getMintingRanges = (
  mintableAmountPerUser: number
): [MintingRange, MintingRange, MintingRange, MintingRange] => {
  const cappedMintableAmountPerUser = Math.min(mintableAmountPerUser, 100)
  const [range1Max, range2Max, range3Max] = [
    Math.floor(cappedMintableAmountPerUser * 0.03),
    Math.floor(cappedMintableAmountPerUser * 0.32),
    Math.floor(cappedMintableAmountPerUser * 0.99),
  ]

  return [
    {
      name: "Shrimp",
      icon: "🦐",
      min: 1,
      max: range1Max,
    },
    {
      name: "Fish",
      icon: "🐠",
      min: range1Max + 1,
      max: range2Max,
    },
    {
      name: "Dolphin",
      icon: "🐬",
      min: range2Max + 1,
      max: range3Max,
    },
    {
      name: "Whale",
      icon: "🐋",
      min: range3Max + 1,
      max: cappedMintableAmountPerUser,
    },
  ]
}

const AmountPicker = () => {
  const { chain, nftAddress } = useCollectNftContext()
  const {
    mintableAmountPerUser: mintableAmountPerUserFromContract,
    totalCollectors,
    maxSupply,
  } = useNftDetails(chain, nftAddress)
  const { data: balance } = useNftBalance({
    nftAddress,
    chainId: Chains[chain],
  })

  const mintableAmountPerUser =
    typeof balance === "bigint" &&
    typeof mintableAmountPerUserFromContract === "number"
      ? Math.min(
          maxSupply - totalCollectors,
          mintableAmountPerUserFromContract - Number(balance)
        )
      : 0

  const ranges = useMemo(
    () =>
      mintableAmountPerUserFromContract
        ? getMintingRanges(mintableAmountPerUserFromContract)
        : undefined,
    [mintableAmountPerUserFromContract]
  )

  const rangeBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const circleBgColor = useColorModeValue("white", "gray.700")
  const circleBorderWidth = useColorModeValue(1, 0)

  const {
    control,
    formState: { errors },
  } = useFormContext<CollectNftForm>()

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
      max: {
        value: mintableAmountPerUser,
        message: `You can collect up to ${mintableAmountPerUser} NFTs`,
      },
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
      setActiveRange(rangeIndex)
    }
  }, [ranges, debouncedAmount])

  if (!ranges) return null

  return (
    <Stack w="full">
      <Stack>
        <Text as="span" fontWeight="medium">
          Amount
        </Text>

        <SimpleGrid columns={{ base: 2, sm: 4 }} gap={2}>
          {ranges.map((range, index) => {
            const isDisabled =
              mintableAmountPerUser < range.min ||
              maxSupply - totalCollectors < range.min
            return (
              <Button
                key={range.name}
                variant="unstyled"
                bgColor={rangeBgColor}
                _hover={{
                  bgColor: isDisabled ? rangeBgColor : undefined,
                }}
                py={4}
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
                    size={12}
                    borderWidth={circleBorderWidth}
                  >
                    <Text as="span" fontSize="lg">
                      {range.icon}
                    </Text>
                  </Circle>

                  <Stack spacing={0}>
                    <Text as="span" fontSize="sm">
                      {range.name}
                    </Text>

                    <Text as="span" fontSize="sm" colorScheme="gray">
                      {range.min === range.max
                        ? range.min
                        : index === ranges.length - 1
                        ? `${range.min}+`
                        : `${range.min} - ${range.max}`}
                    </Text>
                  </Stack>
                </Stack>
              </Button>
            )
          })}
        </SimpleGrid>
      </Stack>

      <FormControl isInvalid={!!errors?.amount}>
        <NumberInput
          value={amount}
          onChange={onAmountChange}
          {...amountField}
          min={1}
          max={mintableAmountPerUser}
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
