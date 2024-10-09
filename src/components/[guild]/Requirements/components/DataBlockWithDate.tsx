import { DataBlock } from "components/common/DataBlock"

type Props = {
  timestamp: number | string // ISO string
}

const DataBlockWithDate = ({ timestamp }: Props): JSX.Element => {
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return <DataBlock>{formattedDate ?? "Invalid date"}</DataBlock>
}

export const BeforeAfterDates = ({
  minTs,
  maxTs,
}: { minTs?: number; maxTs?: number }) => {
  if (maxTs && minTs === undefined)
    return (
      <>
        <span>{` before `}</span>
        <DataBlockWithDate timestamp={maxTs} />
      </>
    )

  if (maxTs === undefined && minTs)
    return (
      <>
        <span>{` after `}</span>
        <DataBlockWithDate timestamp={minTs} />
      </>
    )

  if (maxTs && minTs)
    return (
      <>
        <span>{` between `}</span>
        <DataBlockWithDate timestamp={minTs} />
        <span>{` and `}</span>
        <DataBlockWithDate timestamp={maxTs} />
      </>
    )

  return null
}

export { DataBlockWithDate }
