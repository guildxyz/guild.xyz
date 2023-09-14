import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { ArrowSquareOut, Funnel } from "phosphor-react"
import { PropsWithChildren } from "react"
import { useActivityLog } from "../../ActivityLogContext"
import {
  Filter,
  FILTER_NAMES,
  useActivityLogFilters,
} from "../../ActivityLogFiltersBar/components/ActivityLogFiltersContext"

type Props = {
  addFilterParam: Filter
  viewInCRMParam?: {
    id: string
    value: Record<string, string | string[] | number | number[]>
  }
}

const ClickableTagPopover = ({
  addFilterParam,
  viewInCRMParam,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { isUserActivityLog } = useActivityLog()
  const { urlName, featureFlags } = useGuild()
  const isCRMDisabled = !featureFlags?.includes("CRM")

  const router = useRouter()

  const filtersContext = useActivityLogFilters()
  const { activeFilters, addFilter } = filtersContext ?? {}

  const isDisabled =
    !filtersContext ||
    !!activeFilters.find(
      (f) => f.filter === addFilterParam.filter && f.value === addFilterParam.value
    )

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>

      <Portal>
        <PopoverContent w="max-content">
          <PopoverArrow />

          <PopoverBody p={0} borderRadius="xl" overflow="hidden">
            <Stack spacing={0}>
              <Button
                variant="ghost"
                leftIcon={<Funnel />}
                size="sm"
                borderRadius={0}
                onClick={() => addFilter(addFilterParam)}
                isDisabled={isDisabled}
              >
                {`Filter by ${FILTER_NAMES[addFilterParam.filter].toLowerCase()}`}
              </Button>

              {!isUserActivityLog && viewInCRMParam && (
                <Button
                  variant="ghost"
                  leftIcon={<ArrowSquareOut />}
                  size="sm"
                  borderRadius={0}
                  isDisabled={isCRMDisabled}
                  onClick={() =>
                    router.push(
                      `/${urlName}/members?filters=${JSON.stringify([
                        viewInCRMParam,
                      ])}`
                    )
                  }
                >
                  View in CRM
                </Button>
              )}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default ClickableTagPopover
