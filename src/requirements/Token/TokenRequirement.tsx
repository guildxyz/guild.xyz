import { Text } from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { useEffect } from "react"
import { UseFormSetValue } from "react-hook-form"
import { RequirementComponentProps } from "requirements"
import BlockExplorerUrl from "../common/BlockExplorerUrl"
import Requirement from "../common/Requirement"

type Props = RequirementComponentProps & {
  setValueForBalancy: UseFormSetValue<any>
}

const TokenRequirement = ({ requirement, setValueForBalancy, ...rest }: Props) => {
  const { data, isValidating } = useTokenData(requirement.chain, requirement.address)

  useEffect(() => {
    if (setValueForBalancy && data.decimals)
      setValueForBalancy("balancyDecimals", data.decimals)
  }, [setValueForBalancy, data.decimals])

  return (
    <Requirement
      image={
        data?.logoURI ?? (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            ERC20
          </Text>
        )
      }
      isImageLoading={!data && isValidating}
      footer={
        requirement?.type === "ERC20" && (
          <BlockExplorerUrl requirement={requirement} {...rest} />
        )
      }
      {...rest}
    >
      {`Hold ${
        requirement.data?.maxAmount
          ? `${requirement.data.minAmount} - ${requirement.data.maxAmount}`
          : requirement.data?.minAmount > 0
          ? `at least ${requirement.data?.minAmount}`
          : "any amount of"
      } ${data?.symbol ?? requirement.symbol}`}
    </Requirement>
  )
}

export default TokenRequirement
