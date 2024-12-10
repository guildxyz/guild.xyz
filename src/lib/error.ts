import type { PartialDeep, Primitive } from "type-fest";

//export const promptRetryMessages = [
//  "Please try refreshing or contact support if the issue persists.",
//  "Please follow the instructions provided or contact support for assistance.",
//] as const;

/**
 * Marker type for indicating if a function could throw an Error
 * Note: There is no type enforcement that confirms this type's claim.
 */
export type Either<Data, _ extends Error> = Data;

type ReasonParts = [TemplateStringsArray, ...Record<string, Primitive>[]];

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
  private readonly causeRaw: ReasonParts;

  public override get cause() {
    const interpolated = this.interpolateErrorCause();
    return interpolated ? `Expected ${interpolated}` : undefined;
  }

  /** Tool for constructing the `cause` field */
  public static expected(...args: ReasonParts) {
    return args;
  }

  private interpolateErrorCause(delimiter = " and ") {
    const [templateStringArray, ...props] = this.causeRaw;
    return templateStringArray
      .reduce<Primitive[]>((acc, val, i) => {
        acc.push(
          val,
          ...Object.entries(props.at(i) ?? {})
            .map(([key, value]) => `"${key}" (${String(value)})`)
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
    }>,
  ) {
    super();

    this.name = this.constructor.name;
    this.display = props?.message || this.defaultDisplay;
    this.causeRaw = props?.cause ?? CustomError.expected``;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
    };
  }

  protected get defaultDisplay() {
    return "An error occurred.";
  }
}

/**
 * If the page segment is rendered on server, there is no need for skeleton so it can be thrown indicating it's not meant to be on client.
 * */
export class NoSkeletonError extends CustomError {
  protected override get defaultDisplay() {
    return "Something went wrong while loading the page.";
  }
}

/**
 * For functionality left out intentionally, that would only be relevant later.
 * */
export class NotImplementedError extends CustomError {}

/**
 * Error for custom validations, where `zod` isn't used.
 * */
export class ValidationError extends CustomError {
  protected override get defaultDisplay() {
    return "There are issues with the provided data.";
  }
}
