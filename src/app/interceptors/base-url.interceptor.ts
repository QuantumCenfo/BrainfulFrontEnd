import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const base: string = environment.apiUrl;
  if(!req.url.includes("https://api.unsplash.com")){
    const clonedRequest = req.clone({
      url: `${base}/${req.url}`,
      setHeaders: {
        Accept: 'application/json',
      },
    });
    return next(clonedRequest);
  }
  return next(req);
 

  
};
