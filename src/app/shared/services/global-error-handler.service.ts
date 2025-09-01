import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private readonly loggingService: LoggingService) {}

  handleError(error: any) {
    // TODO: Throw the error again in case you need it to be logged in the console, and call LoggingService to log the error
  }
}