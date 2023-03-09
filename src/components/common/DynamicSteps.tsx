// For some reason the original Steps component causes a hydration error, but since this component doesn't need to be server-side rendered, we can dynamically load it client-side.

import { StepsProps } from "chakra-ui-steps"
import dynamic from "next/dynamic"
import { PropsWithChildren } from "react"

const LazyLoadedSteps = dynamic(() =>
  import("chakra-ui-steps").then((res) => res.Steps)
)

const DynamicSteps = ({
  children,
  ...props
}: PropsWithChildren<StepsProps>): JSX.Element =>
  typeof window !== "undefined" && (
    <LazyLoadedSteps {...props}>{children}</LazyLoadedSteps>
  )

export default DynamicSteps
