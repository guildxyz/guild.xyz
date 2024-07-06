import { Header } from "@/components/Header"
import Section from "components/common/Section"
import { Metadata } from "next"
import { FormExample } from "./_components/FormExample"

export const metadata: Metadata = {
  title: "Playground",
}

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Playground</h1>

      <div className="flex flex-col items-start gap-4">
        <Header />
      </div>

      <Section title="Form">
        <FormExample />
      </Section>
    </div>
  )
}