import { useEffect, useState } from "react"

const useMyPoaps = (account: string) => {
  const [poaps, setPoaps] = useState([])

  useEffect(() => {
    if (!account?.length) setPoaps([])

    fetch(`https://api.poap.xyz/actions/scan/${account}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA", data)
      })
      .catch((err) => console.error)
  }, [account])

  return poaps
}

export default useMyPoaps
