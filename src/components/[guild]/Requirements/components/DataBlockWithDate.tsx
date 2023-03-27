import DataBlock from "./DataBlock"

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

export default DataBlockWithDate
