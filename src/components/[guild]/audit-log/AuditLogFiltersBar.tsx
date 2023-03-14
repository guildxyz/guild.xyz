import { Grid, Select } from "@chakra-ui/react"
import StickyBar from "components/common/Layout/StickyBar"

const AuditLogFiltersBar = (): JSX.Element => {
  const a = "b"

  return (
    <StickyBar>
      <Grid templateColumns="2fr 1fr" gap={4}>
        <Select placeholder="Filter by..." />

        <Select>
          <option selected>Last 1 week</option>
        </Select>
      </Grid>
    </StickyBar>
  )
}

export default AuditLogFiltersBar
