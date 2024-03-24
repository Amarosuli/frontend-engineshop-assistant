import { HttpInterceptorFn } from '@angular/common/http';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
