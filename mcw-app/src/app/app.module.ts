import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorldComponent } from './world.component';
import { HomeComponent } from './home.component';
import { KeyboardComponent } from './keyboard.component';
import { SynthService } from './synth.service';

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    HomeComponent,
    KeyboardComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: Window, useValue: window },
    SynthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
