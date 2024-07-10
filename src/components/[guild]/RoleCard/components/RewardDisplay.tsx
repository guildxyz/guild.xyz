import { ChakraProps, HStack, Stack, Text, Wrap } from "@chakra-ui/react"
import { PropsWithChildren, ReactNode } from "react"

export const RewardDisplay = ({
  icon,
  label,
  rightElement,
  children,
  ...chakraProps
}: PropsWithChildren<
  {
    icon?: ReactNode
    label: ReactNode
    rightElement?: ReactNode
  } & ChakraProps
>) => (
  <HStack pt="3" spacing={2} alignItems={"flex-start"} {...chakraProps}>
    {icon}

    <Stack w="full" spacing={0.5}>
      <Wrap spacingY={0.5}>
        <Text maxW="calc(100% - var(--chakra-sizes-12))">{label}</Text>
        {rightElement}
      </Wrap>

      {children}
    </Stack>
  </HStack>
)
