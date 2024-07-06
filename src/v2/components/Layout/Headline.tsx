import { ReactNode } from "react"
import { PageBoundary } from "../PageBoundary"

interface HeadlineProps {
  title: ReactNode
}

export const Headline = ({ title }: HeadlineProps) => (
  <PageBoundary>
    <h1 className="pb-14 pt-9 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
      {title}
    </h1>
  </PageBoundary>
)
