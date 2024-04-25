import { Box, BoxProps, HStack, Stack, Text } from "@chakra-ui/react"
import Card from "./Card"

type Props = {
  image: JSX.Element
  title: string | JSX.Element
  description?: string | JSX.Element
  action?: JSX.Element
} & BoxProps

const ActionCard = ({ image, title, description, action, ...rest }: Props) => (
  <Card p="6" {...rest}>
    <Stack
      direction={{ base: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      gap="5"
    >
      <HStack gap="4">
        {image}
        <Box>
          <Text fontWeight={"semibold"}>{title}</Text>
          {description && (
            <Text fontWeight={"medium"} colorScheme={"gray"}>
              {description}
            </Text>
          )}
        </Box>
      </HStack>
      {action}
    </Stack>
  </Card>
)

export default ActionCard
