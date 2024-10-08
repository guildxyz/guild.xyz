type Props = {
  anyOfNum?: number
}

const AnyOfHeader = ({ anyOfNum }: Props): JSX.Element => (
  <div className="flex items-center gap-4 py-2">
    <div className="h-4 w-full shrink rounded-tl-xl border-border-muted border-t" />
    <div className="-top-2 relative flex min-w-max items-center justify-center font-bold text-muted-foreground/50 text-xs">
      {`ANY ${anyOfNum} OF`}
    </div>
    <div className="h-4 w-full shrink rounded-tr-xl border-border-muted border-t" />
  </div>
)

export { AnyOfHeader }
