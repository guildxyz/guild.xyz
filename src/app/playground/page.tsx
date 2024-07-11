import { Header } from "@/components/Header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playground",
}

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl">Playground</h1>

      <div className="flex flex-col items-start gap-4">
        <Header />
      </div>
    </div>
  )
}
