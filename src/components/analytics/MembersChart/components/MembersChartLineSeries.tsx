import {
  Box,
  Checkbox,
  CheckboxGroup,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { forwardRef, useRef } from "react"
import SimpleRoleTag from "./SimpleRoleTag"

const MembersChartLineSeries = ({
  sortedRoles,
  roleColors,
  shownRoleIds,
  setShownRoleIds,
}) => {
  const lineSelectorBg = useColorModeValue("gray.50", "blackAlpha.300")
  const lineSelectorBorderColor = useColorModeValue("gray.200", "gray.600")
  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )
  const scrollRef = useRef(null)

  return (
    <Box
      position={"relative"}
      w={{ md: "220px" }}
      flex="0 0 auto"
      borderLeftWidth={{ md: 1 }}
      borderTopWidth={{ base: 1, md: 0 }}
      borderColor={lineSelectorBorderColor}
    >
      <CheckboxGroup
        value={shownRoleIds}
        onChange={(newValue) => setShownRoleIds(newValue)}
      >
        <Stack
          ref={scrollRef}
          h="full"
          maxH={{ base: "300px", md: "564px" }}
          overflowY={"auto"}
          py="5"
          px="6"
          pr="8"
          bg={lineSelectorBg}
        >
          <LineSeriesSelector
            color="var(--chakra-colors-chakra-body-text)"
            value="total"
          >
            Total
          </LineSeriesSelector>
          {sortedRoles?.map((role) => (
            <LineSeriesSelector
              key={role.id}
              color={roleColors[role.id]}
              value={role.id.toString()}
            >
              <SimpleRoleTag role={role} />
            </LineSeriesSelector>
          ))}
        </Stack>
      </CheckboxGroup>
      {scrollRef.current?.scrollHeight > scrollRef.current?.clientHeight && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height={6}
          bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
          pointerEvents="none"
          opacity={0.6}
        />
      )}
    </Box>
  )
}

const LineSeriesSelector = forwardRef<any, any>(
  ({ value, color, children }, ref) => (
    <Checkbox
      ref={ref}
      value={value}
      _checked={{
        "> .chakra-checkbox__control[data-checked]": {
          bgColor: color,
          borderColor: color,
        },
      }}
    >
      {children}
    </Checkbox>
  )
)

export default MembersChartLineSeries
