import { Header } from "@/components/Header"
import { Metadata } from "next"
import Link from "next/link"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Playground",
}

const Section = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-lg font-bold">{title}</h2>
    {children}
  </section>
)

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Playground</h1>

      <div className="flex flex-col items-start gap-4">
        <Header />

        <span>
          Go to <Link href="/explorer">explorer</Link>
        </span>
      </div>
    </div>
  )
}
