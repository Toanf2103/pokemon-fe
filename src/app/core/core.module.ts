// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  providers: [
    {
      provide: TokenInterceptor,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
