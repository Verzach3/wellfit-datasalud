type ErrorType<BodyType> = {
  message: string;
  status: number;
} & (BodyType extends undefined ? {} : { body: BodyType });

export function createError<BodyType>(
  message: string,
  status: number,
  body?: BodyType,
): ErrorType<BodyType> {
  if (!body) {
    return {
      message,
      status,
    };
  }
  return {
    message,
    status,
    body,
  };
}
