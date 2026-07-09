export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }
}
