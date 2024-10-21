import { CopyableAddress } from "@/components/CopyableAddress"
import { ReactNode } from "react"

type Props = {
  params: Record<string, string>
}

const StrategyParamsTable = ({ params }: Props): ReactNode => (
  <table className="w-full table-fixed rounded-xl bg-card dark:bg-blackAlpha">
    <thead className="border-border border-b text-left text-sm">
      <tr className="[&>th]:p-1.5">
        <th>Param</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody className="text-xs">
      {Object.entries(params || {})?.map(([name, value]) => (
        <tr
          key={name}
          className="border-border border-b last:border-none [&>td]:p-1.5"
        >
          <td>{name}</td>
          <td>
            {value?.toString()?.startsWith("0x") ? (
              <CopyableAddress
                address={value.toString()}
                className="font-normal text-xs"
              />
            ) : (
              value?.toString()
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export { StrategyParamsTable }
