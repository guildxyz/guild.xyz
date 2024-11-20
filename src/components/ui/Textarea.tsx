import { type TextareaHTMLAttributes, forwardRef } from "react";
import { inputVariants } from "./Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={inputVariants({
          size: "md",
          className: "flex min-h-[80px] w-full",
        })}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
