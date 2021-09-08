import { IconProps } from "phosphor-react"
import { EventData, State } from "xstate"

type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type MetaMaskError = { code: number; message: string }

type Machine<Context> = [
  State<Context>,
  (event: string, payload?: EventData) => State<Context>
]

type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

type Rest = {
  [x: string]: any
}

export type { Token, MetaMaskError, Machine, Icon, Rest }
