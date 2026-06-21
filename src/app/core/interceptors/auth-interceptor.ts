import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { loaderService } from '../../service/loader_service';
import { finalize } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(loaderService);
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  console.log("interceptor call");
  const newReq = req.clone({
    setHeaders: {
      token: `${token}`
    }
  });
  loader.Show();
  return next(newReq).pipe(
    finalize(() => {
      loader.hide();
    })
  );
};
