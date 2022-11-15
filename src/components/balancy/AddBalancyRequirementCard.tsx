import { Divider, Icon, Stack, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { CurrencyCircleDollar, ImageSquare, ListChecks, Plus } from "phosphor-react"
import { FC } from "react"
import { RequirementType } from "requirements"

type RequirementButton = {
  icon: FC
  label: string
  type: RequirementType
  disabled?: boolean
}

const options: Array<RequirementButton> = [
  {
    icon: CurrencyCircleDollar,
    label: "Token",
    type: "ERC20",
  },
  {
    icon: ImageSquare,
    label: "NFT",
    type: "ERC721",
  },
  {
    icon: ListChecks,
    label: "Allowlist",
    type: "ALLOWLIST",
  },
]

type Props = {
  onAdd: (type: RequirementType) => void
}

const AddBalancyRequirementCard = ({ onAdd }: Props): JSX.Element => {
  const onClick = (type: RequirementType) => {
    onAdd(type)
  }

  const borderColor = useColorModeValue("#b6b6c4", "gray.600")

  return (
    <CardMotionWrapper>
      <ColorCard pt="10 !important" color={borderColor} bg="null" h="full">
        <ColorCardLabel
          label="Add requirement"
          h="8"
          color={borderColor}
          borderColor={borderColor}
          border="2px"
          top="-2px"
          left="-2px"
          borderTopLeftRadius="2xl"
          borderBottomRightRadius="xl"
        >
          <Icon as={Plus} />
        </ColorCardLabel>
        <Stack h="full" divider={<Divider />}>
          {options.map((requirementButton: RequirementButton, index: number) => (
            <Button
              key={requirementButton.type}
              variant="ghost"
              w="full"
              minH={20}
              h="full"
              onClick={() => onClick(requirementButton.type)}
              leftIcon={<Icon as={requirementButton.icon} boxSize={6} />}
              justifyContent={"left"}
            >
              {requirementButton.label}
            </Button>
          ))}
        </Stack>
      </ColorCard>
    </CardMotionWrapper>
  )
}

export default AddBalancyRequirementCard
