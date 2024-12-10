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

type Cause = [TemplateStringsArray, ...Record<string, Primitive>[]];

export class CustomError extends Error {
  public readonly cause: ReturnType<typeof CustomError.expected>;
  public readonly name: string;
  public readonly display: string;

  public override get message() {
    return [this.display, this.parsedErrorCause].filter(Boolean).join("\n\n");
  }

  public static expected(...args: Cause) {
    return args;
  }

  private get parsedErrorCause() {
    const interpolated = this.interpolateErrorCause();
    return interpolated ? `Expected ${interpolated}` : undefined;
  }

  private interpolateErrorCause(delimiter = " and ") {
    const [templateStringArray, ...props] = this.cause;

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
      cause: Cause;
    }>,
  ) {
    super(undefined, { cause: props?.cause });

    this.name = this.constructor.name;
    this.display = props?.message || this.defaultDisplay;
    this.cause = props?.cause ?? CustomError.expected``;
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

export class NoSkeletonError extends CustomError {
  protected override get defaultDisplay() {
    return "Something went wrong while loading the page.";
  }
}

export class NotImplementedError extends CustomError {}

export class ValidationError extends CustomError {
  protected override get defaultDisplay() {
    return "There are issues with the provided data.";
  }

  //constructor(...props: ConstructorParameters<typeof CustomError>) {
  //  super(...props);
  //}
}
