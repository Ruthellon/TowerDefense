import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngryElfAPI } from './Services/angryelfapi.service';
import { IAngryElfAPIService } from './Services/angryelfapi.service.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CookieService } from './Services/cookie.service';
import { ICookieService } from './Services/cookie.service.interface';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
    provide: IAngryElfAPIService,
    useClass: AngryElfAPI
    },
    {
      provide: ICookieService,
      useClass: CookieService
    },
    provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
