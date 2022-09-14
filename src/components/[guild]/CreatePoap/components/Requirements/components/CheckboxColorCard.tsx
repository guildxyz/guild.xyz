import {
  Box,
  CheckboxProps,
  Circle,
  Collapse,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  useCheckbox,
  useColorModeValue,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import { Check, IconProps } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  colorScheme: string
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  title: JSX.Element | string
  description?: string
  comingSoon?: boolean
} & Omit<CheckboxProps, "icon" | "colorScheme" | "title">

const CheckboxColorCard = ({
  colorScheme,
  icon,
  title,
  description,
  comingSoon,
  children,
  ...checkboxProps
}: PropsWithChildren<Props>): JSX.Element => {
  const { state, getInputProps, getCheckboxProps } = useCheckbox(checkboxProps)

  const cardBgColor = useColorModeValue("gray.50", "whiteAlpha.50")
  const iconBgColor = useColorModeValue("gray.200", "gray.600")

  return (
    <ColorCard
      color={state.isChecked ? `${colorScheme}.500` : "transparent"}
      bgColor={cardBgColor}
      transition="border-color 0.24s ease"
    >
      <Stack w="full" spacing={0}>
        <Box
          as="label"
          {...getCheckboxProps()}
          cursor={state.isDisabled ? undefined : "pointer"}
          opacity={comingSoon ? 0.5 : 1}
        >
          <input {...getInputProps()} />
          <HStack justifyContent="space-between">
            <HStack spacing={4}>
              <Circle bgColor={iconBgColor} size={12}>
                <Icon as={icon} boxSize={4} />
              </Circle>

              <Stack spacing={1}>
                {typeof title === "string" ? (
                  <Text as="span" fontWeight="bold">
                    {title}
                  </Text>
                ) : (
                  title
                )}
                <Text color="gray">{description}</Text>
              </Stack>
            </HStack>
            {!comingSoon && (
              <Flex
                alignItems="center"
                justifyContent="center"
                boxSize={5}
                minW={5}
                minH={5}
                borderWidth={2}
                borderRadius="sm"
                borderColor={state.isChecked ? `${colorScheme}.500` : undefined}
                bgColor={state.isChecked ? `${colorScheme}.500` : undefined}
                color="white"
              >
                {state.isChecked && <Icon as={Check} />}
              </Flex>
            )}
          </HStack>
        </Box>

        {!comingSoon && (
          <Collapse in={state.isChecked}>
            <Box pt={6}>{children}</Box>
          </Collapse>
        )}
      </Stack>
    </ColorCard>
  )
}

export default CheckboxColorCard
