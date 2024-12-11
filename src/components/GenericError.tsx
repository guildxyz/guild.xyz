"use client";

import { type CustomError, ValidationError } from "@/lib/error";
import { useErrorBoundary } from "react-error-boundary";
import Markdown from "react-markdown";
import { ZodError } from "zod";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/Collapsible";

export const GenericError = ({ error }: { error: CustomError | ZodError }) => {
  const { resetBoundary } = useErrorBoundary();
  const convergedError =
    error instanceof ZodError ? ValidationError.fromZodError(error) : error;

  return (
    <Card role="alert" className="size-full bg-red-400/20 p-6 text-red-200">
      <div className="max-w-prose space-y-4">
        <h3 className="font-bold">{convergedError.display}</h3>
        {convergedError.cause && (
          <Collapsible>
            <CollapsibleTrigger className="mb-4 underline decoration-dashed underline-offset-4">
              Read more about what went wrong
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Markdown>{convergedError.cause}</Markdown>
            </CollapsibleContent>
          </Collapsible>
        )}
        {error.recoverable && (
          <Button
            onClick={resetBoundary}
            variant="subtle"
            colorScheme="destructive"
          >
            Try again
          </Button>
        )}
      </div>
    </Card>
  );
};
