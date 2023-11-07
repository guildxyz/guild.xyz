import {
  Box,
  Center,
  HStack,
  Select,
  Spinner,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Axis, Grid, LineSeries, XYChart, allColors } from "@visx/xychart"
import useGuild from "components/[guild]/hooks/useGuild"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useEffect, useMemo, useState } from "react"
import MembersChartLineSeries from "./components/MembersChartLineSeries"
import MembersChartTooltip from "./components/MembersChartTooltip"

const getRandomInt = (max) => Math.floor(Math.random() * max)

const accessors = {
  xAccessor: (d) => new Date(d?.timestamp),
  yAccessor: (d) => d.count,
}

const CHART_MARGIN_X = 18

const date = new Date()
const current = date.toISOString()
date.setMonth(date.getMonth() - 3)
const prev = date.toISOString()

const MembersChart = () => {
  const { id, roles } = useGuild()
  const chartHeight = useBreakpointValue({ base: 250, md: 500 })

  const { data, isLoading, error } = useSWRWithOptionalAuth(
    id
      ? `/v2/analytics/guilds/${id}/member-counts?fetchTotal=true&from=${prev}&to=${current}`
      : null
  )

  const sortedRoles = useMemo(() => {
    const byMembers = roles?.sort(
      (role1, role2) => role2.memberCount - role1.memberCount
    )
    return byMembers
  }, [roles])

  const [shownRoleIds, setShownRoleIds] = useState(["total"])
  useEffect(() => {
    if (!roles) return
    setShownRoleIds(["total", ...roles?.map((role) => role.id.toString())])
  }, [roles])

  const roleColors = useMemo(
    () =>
      roles?.reduce((acc, curr) => {
        acc[curr.id] =
          /* curr.imageUrl
          ? await getColorByImage(curr.imageUrl)
          : */ Object.values(allColors)[getRandomInt(9)][4]
        return acc
      }, {}),
    [roles]
  )

  return (
    <Card flexDirection={{ base: "column", md: "row" }}>
      <Box
        flex="1 1 auto"
        overflow={"hidden"}
        sx={{
          ".visx-axis-tick": { text: { fill: "currentColor" } },
          // WebkitMaskImage:
          //   "linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent)",
        }}
      >
        <HStack p="4" justifyContent={"space-between"}>
          <Text fontWeight={"bold"} px="1">
            Member counts
          </Text>
          <Tooltip label="Soon" hasArrow>
            <Select size="sm" w="auto" isDisabled>
              <option>Last 3 months</option>
            </Select>
          </Tooltip>
        </HStack>
        {error ? (
          <Center w="full" h={chartHeight}>
            <ErrorAlert
              label="Couldn't load chart"
              description={error?.error}
              maxW="300px"
            />
          </Center>
        ) : isLoading ? (
          <Center w="full" h={chartHeight}>
            <Spinner />
          </Center>
        ) : (
          <XYChart
            height={chartHeight}
            margin={{
              left: CHART_MARGIN_X,
              top: 35,
              bottom: 35,
              right: CHART_MARGIN_X,
            }}
            xScale={{ type: "time" }}
            yScale={{ type: "linear" }}
          >
            <Grid
              columns={false}
              numTicks={4}
              lineStyle={{
                stroke: "var(--chakra-colors-chakra-border-color)",
                strokeLinecap: "round",
                strokeWidth: 1,
              }}
              strokeDasharray="2, 4"
            />
            <Axis
              hideAxisLine
              hideTicks
              orientation="bottom"
              labelProps={{ fill: "var(--chakra-colors-chakra-body-text)" }}
              tickLabelProps={(value, index, ticks) => ({
                textAnchor:
                  index === 0
                    ? "start"
                    : index === ticks[ticks.length - 1].index
                    ? "end"
                    : "middle",
              })}
              numTicks={4}
              left={16}
            />
            <Axis
              hideAxisLine
              hideTicks
              hideZero
              orientation="left"
              numTicks={4}
              tickFormat={(value) =>
                new Intl.NumberFormat("en", { notation: "compact" }).format(value)
              }
              left={CHART_MARGIN_X}
              tickLabelProps={() => ({
                dy: 14,
                dx: 4,
                textAnchor: "start",
              })}
            />
            {data?.total && shownRoleIds?.includes("total") && (
              <LineSeries
                stroke="currentColor"
                dataKey="total"
                data={data.total}
                {...accessors}
              />
            )}
            {data?.roles &&
              data.roles
                .filter((role) => shownRoleIds?.includes(role.roleId.toString()))
                .map(({ roleId, memberCounts }) => (
                  <LineSeries
                    key={roleId}
                    dataKey={roleId}
                    stroke={roleColors[roleId]}
                    data={memberCounts}
                    {...accessors}
                  />
                ))}
            <MembersChartTooltip {...{ accessors, roleColors }} />
          </XYChart>
        )}
      </Box>
      <MembersChartLineSeries
        {...{ sortedRoles, roleColors, shownRoleIds, setShownRoleIds }}
      />
    </Card>
  )
}

export default MembersChart
