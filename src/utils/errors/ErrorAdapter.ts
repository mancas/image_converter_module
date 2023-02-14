interface AppError {
  statusCode?: number
  data?: Record<string, unknown>
}

export default class ErrorAdapter {
  private message
  private code
  private data
  private type
  private status
  private stack
  private createdAt
  constructor(error: Error & AppError, serviceStatusCode = 500) {
    this.message = error.message
    this.code = error.statusCode || serviceStatusCode
    this.data = error.data || {}
    this.type = Object.getPrototypeOf(error).constructor.name
    this.status = 'ko'
    this.stack = error.stack
    this.createdAt = new Date().toISOString()
  }

  toLog() {
    return {
      message: this.message,
      code: this.code,
      data: this.data,
      type: this.type,
      status: 'ko',
      stack: this.stack,
      createdAt: this.createdAt,
    }
  }

  toResponse() {
    return {
      message: this.message,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
    }
  }
}
