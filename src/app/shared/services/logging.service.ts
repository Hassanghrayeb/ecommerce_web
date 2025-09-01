import { DatePipe } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { HttpBaseClass } from '../base/http-base.class';
import { LoggingLevel } from '../enums/logging-level.enum';

@Injectable()
export class LoggingService extends HttpBaseClass {
    loggingUrl = '';

    constructor(public injector: Injector, public datepipe: DatePipe) {
        super(injector);
    }

    log(msg: string, ...params: any[]) {
        this.writeToConsoleLog(msg, LoggingLevel.ALL, params);
        this.sendLogsToBackend(msg, LoggingLevel.ALL, params);
    }

    debug(msg: string, ...params: any[]) {
        this.writeToConsoleLog(msg, LoggingLevel.DEBUG, params);
        this.sendLogsToBackend(msg, LoggingLevel.DEBUG, params);
    }

    info(msg: string, ...params: any[]) {
        this.writeToConsoleLog(msg, LoggingLevel.INFO, params);
        this.sendLogsToBackend(msg, LoggingLevel.INFO, params);
    }

    warn(msg: string, ...params: any[]) {
        this.writeToConsoleLog(msg, LoggingLevel.WARN, params);
        this.sendLogsToBackend(msg, LoggingLevel.WARN, params);
    }

    error(msg: string, ...params: any[]) {
        this.writeToConsoleLog(msg, LoggingLevel.ERROR, params);
        this.sendLogsToBackend(msg, LoggingLevel.ERROR, params);
    }

    fatal(msg: string, ...params: any[]) {
        this.writeToConsoleLog(msg, LoggingLevel.FATAL, params);
        this.sendLogsToBackend(msg, LoggingLevel.FATAL, params);
    }

    private writeToConsoleLog(msg: string, level: LoggingLevel, params: any[]) {
        // TODO: Implement your own log function
    }

    private sendLogsToBackend(msg: string, level: LoggingLevel, params: any[]) {
        // TODO: Implement your own backend logging
    }
}
