import { Icon, Spinner, Text } from "@chakra-ui/react"
import type { IconProps } from "@phosphor-icons/react"
import Card from "components/common/Card"
import { ForwardRefExoticComponent } from "react"

type FallbackProps = {
  isLoading?: boolean
  icon?: ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  title?: string
  text: string
}

const FallbackFrame = ({ isLoading, icon, title, text }: FallbackProps) => (
  <Card mb={10} paddingY={14} paddingX={4} alignItems="center">
    {isLoading ? (
      <Spinner mb={2} size="lg" />
    ) : icon ? (
      <Icon
        as={icon}
        rounded="full"
        boxSize={8}
        fontWeight="thin"
        mb={2}
        color="gray"
      />
    ) : null}

    {title && (
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
    )}

    <Text colorScheme="gray" mt="2" textAlign={"center"}>
      {text}
    </Text>
  </Card>
)

export default FallbackFrame
