import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handle(error: any, message: string): void {
    console.info('ERROR : ', error.error.message);

    throwError(() => new Error(message));
  }
}
