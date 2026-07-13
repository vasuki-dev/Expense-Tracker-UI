import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { loaderService } from '../../service/loader_service';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { loginService } from '../../service/login_service';
import { Router } from '@angular/router';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(loaderService);
  const authService = inject(loginService);
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  console.log("interceptor call");
  const newReq = req.clone({
    setHeaders: {
      token: `${token}`
    }
  });
  loader.Show();
  return next(newReq).pipe(
    catchError((error) => {

      if (error.status === 401 || error.status === 403) {
        let tokenPayload = {
          refreshToken: localStorage.getItem('refresh_token')
        }

        return authService.refreshToken(tokenPayload).pipe(
          switchMap((res: any) => {
           localStorage.setItem('access_token', res?.accessToken);
            const reReq = req.clone({
              setHeaders: {
                token: res?.accessToken
              }
            });
            return next(reReq);
          }),
          catchError((refreshError) => {

            localStorage.clear();

            // login page redirect
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })

        );

      }

      return throwError(() => error);

    }),
    finalize(() => {
      loader.hide();
    })
  );
};
