import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  console.log("interceptor call");
  const newReq = req.clone({
    setHeaders: {
      token: `${token}`
    }
  })
  return next(newReq);
};
