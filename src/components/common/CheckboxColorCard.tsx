import {
  Box,
  Checkbox,
  CheckboxProps,
  Circle,
  Collapse,
  HStack,
  Icon,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { IconProps } from "@phosphor-icons/react/dist/lib/types"
import ColorCard from "components/common/ColorCard"
import { PropsWithChildren, forwardRef, useState } from "react"

type Props = {
  colorScheme: string
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  title: JSX.Element | string
  description?: string
  disabledText?: string
  variant?: CheckboxColorCardVariant
} & Omit<CheckboxProps, "icon" | "colorScheme" | "title">

type CheckboxColorCardVariant = "solid" | "outline"

const CheckboxColorCard = forwardRef(
  (
    {
      colorScheme,
      icon,
      title,
      description,
      disabledText,
      variant = "solid",
      children,
      ...rest
    }: PropsWithChildren<Props>,
    ref: any
  ) => {
    const iconBgColor = useColorModeValue(
      "blackAlpha.200",
      variant === "outline" ? "blackAlpha.300" : "gray.600"
    )
    const outlineVariantBgColor = useColorModeValue("white", "gray.800")

    const [isChecked, setIsChecked] = useState(rest.defaultChecked)

    const isDisabled = !!disabledText || rest.isDisabled

    return (
      <ColorCard
        color={isChecked ? `${colorScheme}.500` : "transparent"}
        transition="border-color 0.24s ease"
        {...(variant === "solid"
          ? {
              borderWidth: 2,
            }
          : {
              boxShadow: "none",
              borderWidth: isChecked ? 2 : 1,
              borderColor: isChecked ? `${colorScheme}.500` : "border",
              bg: outlineVariantBgColor,
              sx: {
                "> div": {
                  margin: isChecked ? 0 : "1px",
                },
              },
            })}
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
            isDisabled={isDisabled}
            _checked={{
              "> .chakra-checkbox__control[data-checked]": {
                bgColor: `var(--chakra-colors-${colorScheme}-500)`,
                borderColor: `var(--chakra-colors-${colorScheme}-500)`,
                color: "white",
                opacity: 1,
              },
              "> .chakra-checkbox__label[data-disabled]": {
                opacity: 1,
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
                <HStack>
                  {typeof title === "string" ? (
                    <Text as="span" fontWeight="bold">
                      {title}
                    </Text>
                  ) : (
                    title
                  )}

                  {disabledText && <Tag>{disabledText}</Tag>}
                </HStack>
                <Text color="gray">{description}</Text>
              </Stack>
            </HStack>
          </Checkbox>

          <Collapse in={isChecked}>
            <Box pt={6} opacity={isDisabled ? 0.5 : 1}>
              {children}
            </Box>
          </Collapse>
        </Stack>
      </ColorCard>
    )
  }
)

export default CheckboxColorCard
