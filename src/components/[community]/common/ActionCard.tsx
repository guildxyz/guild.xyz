import { Heading, Text, Wrap } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import Card from "../../common/Card"

type Props = {
  title: string
  description: string | JSX.Element[]
}

const ActionCard = ({
  title,
  description,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Card isFullWidthOnMobile p={6} h="full">
    <Heading size="sm" mb="2">
      {title}
    </Heading>
    <Text fontWeight="medium">{description}</Text>
    {children && (
      <Wrap spacing="2" pt="6" justify="flex-end" mt="auto" shouldWrapChildren>
        {children}
      </Wrap>
    )}
  </Card>
)

export default ActionCard
