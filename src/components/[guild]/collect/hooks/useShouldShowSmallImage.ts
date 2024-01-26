import useScrollEffect from "hooks/useScrollEffect"
import { MutableRefObject, useState } from "react"

const useShouldShowSmallImage = (
  descriptionRef: MutableRefObject<HTMLDivElement>
): boolean => {
  const [shouldShowSmallImage, setShouldShowSmallImage] = useState(false)
  useScrollEffect(
    () =>
      setShouldShowSmallImage(
        descriptionRef.current?.getBoundingClientRect().top < 100
      ),
    []
  )

  return shouldShowSmallImage
}

export default useShouldShowSmallImage
