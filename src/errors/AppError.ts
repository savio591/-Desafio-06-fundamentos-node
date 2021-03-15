class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    // eslint-disable-next-line no-console
    console.log({
      message, statusCode
    })
  }
}

export default AppError;
