import { useEffect, useRef } from "react"
import Jazzicon from "@metamask/jazzicon"
import { Center } from "@chakra-ui/react"

type Props = {
  address: string
}

const Identicon = ({ address }: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = ""
      ref.current.appendChild(Jazzicon(40, parseInt(address.slice(2, 10), 16)))
    }
  }, [address])

  return <Center ref={ref} />
}

export default Identicon
