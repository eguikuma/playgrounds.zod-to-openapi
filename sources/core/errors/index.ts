export class ZodocsError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class ConfigError extends ZodocsError {
  constructor(message: string) {
    super(message);
  }
}

export class SchemaError extends ZodocsError {
  constructor(message: string) {
    super(message);
  }
}

export class DocumentError extends ZodocsError {
  constructor(message: string) {
    super(message);
  }
}
