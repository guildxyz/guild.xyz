import {
  Box,
  Checkbox,
  CheckboxProps,
  Circle,
  Collapse,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import { IconProps } from "phosphor-react"
import { forwardRef, PropsWithChildren, useState } from "react"

type Props = {
  colorScheme: string
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  title: JSX.Element | string
  description?: string
} & Omit<CheckboxProps, "icon" | "colorScheme" | "title">

const CheckboxColorCard = forwardRef(
  (
    {
      colorScheme,
      icon,
      title,
      description,
      children,
      ...rest
    }: PropsWithChildren<Props>,
    ref: any
  ) => {
    const cardBgColor = useColorModeValue("gray.50", "whiteAlpha.50")
    const iconBgColor = useColorModeValue("gray.200", "gray.600")

    const [isChecked, setIsChecked] = useState(rest.defaultChecked)

    return (
      <ColorCard
        color={isChecked ? `${colorScheme}.500` : "transparent"}
        bgColor={cardBgColor}
        transition="border-color 0.24s ease"
      >
        <Stack spacing={0}>
          <Checkbox
            w="full"
            spacing={0}
            ref={ref}
            {...rest}
            flexDirection="row-reverse"
            justifyContent="space-between"
            colorScheme={colorScheme}
            color="white"
            _checked={{
              "> .chakra-checkbox__control": {
                bgColor: `var(--chakra-colors-${colorScheme}-500)`,
                borderColor: `var(--chakra-colors-${colorScheme}-500)`,
                color: "white",
              },
            }}
            onChange={(e) => {
              rest.onChange?.(e)
              setIsChecked(e.target.checked)
            }}
          >
            <HStack spacing={4} pr={4}>
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
          </Checkbox>

          <Collapse in={isChecked}>
            <Box pt={6}>{children}</Box>
          </Collapse>
        </Stack>
      </ColorCard>
    )
  }
)

export default CheckboxColorCard
