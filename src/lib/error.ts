import type { PartialDeep, Primitive } from "type-fest";
import type { ZodError } from "zod";

//export const promptRetryMessages = [
//  "Please try refreshing or contact support if the issue persists.",
//  "Please follow the instructions provided or contact support for assistance.",
//] as const;

/**
 * Marker type for indicating if a function could throw an Error
 * Note: There is no type enforcement that confirms this type's claim.
 */
export type Either<Data, _ extends Error> = Data;

type ReasonParts = [ArrayLike<string>, ...Record<string, Primitive>[]];

/**
 * Serializable `Error` object custom errors derive from.
 */
export class CustomError extends Error {
  /** Error identifier, indentical to class name */
  public readonly name: string;
  /** Human friendly message for end users */
  public readonly display: string;
  /** Parsed final form of `display` and `cause` */
  public override get message() {
    return [this.display, this.cause].filter(Boolean).join("\n\n");
  }
  public causeRaw: ReasonParts;

  public recoverable: boolean;

  public override get cause() {
    const interpolated = this.interpolateErrorCause();
    return interpolated ? `Expected ${interpolated}` : undefined;
  }

  /** Tool for constructing the `cause` field */
  public static expected(...args: ReasonParts) {
    return args;
  }

  private interpolateErrorCause(delimiter = ", ") {
    const [templateStringArray, ...props] = this.causeRaw;
    return Array.from(templateStringArray)
      .reduce<Primitive[]>((acc, val, i) => {
        acc.push(
          val,
          ...Object.entries(props.at(i) ?? {})
            .map(([key, value]) => `**${key}** \`${String(value)}\``)
            .join(delimiter),
        );
        return acc;
      }, [])
      .join("");
  }

  public constructor(
    props?: PartialDeep<{
      message: string;
      cause: ReasonParts;
      recoverable: boolean;
    }>,
  ) {
    super();

    this.name = this.constructor.name;
    this.display = props?.message || this.defaultDisplay;
    this.causeRaw = props?.cause ?? CustomError.expected``;
    this.recoverable = props?.recoverable || false;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      display: this.display,
    };
  }

  protected get defaultDisplay() {
    return "An error occurred.";
  }
}

/**
 * Page segment is meant to be rendered on server, but was called on the client.
 */
export class NoSkeletonError extends CustomError {
  protected override get defaultDisplay() {
    return "Something went wrong while loading the page.";
  }
}

/**
 * For functionality left out intentionally, that would only be relevant later.
 */
export class NotImplementedError extends CustomError {}

/**
 * Error for custom validations, where `zod` isn't used.
 */
export class ValidationError extends CustomError {
  protected override get defaultDisplay() {
    return "There are issues with the provided data.";
  }

  public static fromZodError(error: ZodError): ValidationError {
    const result = new ValidationError();
    const parsedIssues = error.issues.flatMap((issue) => {
      const path = issue.path.join(" -> ");
      const { message, code } = issue;
      return Object.entries({ code, path, message }).map((entry) =>
        Object.fromEntries([entry]),
      );
    });

    if (error.issues.length) {
      result.causeRaw = [
        [
          "Zod validation to pass, but failed at:  \n",
          ...parsedIssues
            .slice(error.issues.length * 2)
            .flatMap(() => [" occured at ", " with ", ".  \n"]),
        ],
        ...parsedIssues,
      ];
    }

    return result;
  }
}

/**
 * Successful response came in during fetching, but the response could not be
 * handled.
 */
export class FetchError extends CustomError {
  protected override get defaultDisplay() {
    return "Failed to retrieve data.";
  }
}

/**
 * On parsing a response with zod that isn't supposed to fail. Note that this could also happen when requesting a similar but wrong endpoint.
 */
export class ResponseMismatchError extends CustomError {
  protected override get defaultDisplay() {
    return "Failed to retrieve data.";
  }
}
