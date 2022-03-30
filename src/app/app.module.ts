import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ClipboardModule } from 'ngx-clipboard'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { TinyTownsComponent } from './tiny-towns.component'

@NgModule({
  declarations: [
    AppComponent,
    TinyTownsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClipboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }