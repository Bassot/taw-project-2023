import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import {getToken} from "./User/user.service";
import { WaiterComponent } from './waiter/waiter.component';
import { CookComponent } from './cook/cook.component';
import { BartenderComponent } from './bartender/bartender.component';
import { CashierComponent } from './cashier/cashier.component';

export function tokenGetter() {
  return getToken();
}

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserSignupComponent,
    WaiterComponent,
    CookComponent,
    BartenderComponent,
    CashierComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        authScheme: "Basic",
        allowedDomains: ["http://localhost:8080"],
        disallowedRoutes: ["http://localhost:8080/login","http://localhost:8080/register"],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
