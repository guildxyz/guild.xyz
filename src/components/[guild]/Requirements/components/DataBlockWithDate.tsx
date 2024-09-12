import DataBlock from "components/common/DataBlock"

type Props = {
  timestamp: number
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
        {` before `}
        <DataBlockWithDate timestamp={maxTs} />
      </>
    )

  if (maxTs === undefined && minTs)
    return (
      <>
        {` after `}
        <DataBlockWithDate timestamp={minTs} />
      </>
    )

  if (maxTs && minTs)
    return (
      <>
        {` between `}
        <DataBlockWithDate timestamp={minTs} />
        {` and `}
        <DataBlockWithDate timestamp={maxTs} />
      </>
    )

  return null
}

export default DataBlockWithDate
