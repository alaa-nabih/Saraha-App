export class notFoundException extends Error {
  constructor(name="url") {
    super(" not found "+ name , { cause: 404 })
  }
}

export class notValidEmail extends Error {
  constructor(message = "Email is not valid") {
    super(message)
    this.name = "notValidEmail"
    this.statusCode = 400
  }
}

export class InvalidCredentialsException extends Error {
  constructor() {
    super('invalid credentials', { cause: 401 })
  }
}

export class notAuthorized extends Error {
  constructor(message = "Not authorized") {
    super(message)
    this.name = "UnAuthorized"
    this.statusCode = 409
  }
}

export class inValidOtp extends Error {
  constructor() {
    super('in-valid OTP!',{ cause: 409 })
  }
}

export class otpExpiredException extends Error {
  constructor() {
    super(' OTP Expired',{ cause: 409 })
  }
}

export class NotConfirmedEmailException extends Error {
  constructor() {
    super('please confirm your email', { cause: 400 })
  }
}

export class LoginAgainException extends Error {
  constructor() {
    super('please login again', { cause: 401 })
  }
}

export class InValidLoginMethodException extends Error {
  constructor() {
    super('in-valid login method', { cause: 400 });
  }
}