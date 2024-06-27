import { Button } from "@/ui/Button"

export default function Page() {
  return (
    <div>
      <h1>Playground</h1>
      <div className="space-x-2">
        <Button variant="default">primary (default)</Button>
        <Button variant="accent">accent</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="destructive">destructive</Button>
      </div>
    </div>
  )
}
