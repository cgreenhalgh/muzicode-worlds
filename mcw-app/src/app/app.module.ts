import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { WorldComponent } from './world.component';
import { HomeComponent } from './home.component';
import { KeyboardComponent } from './keyboard.component';
import { SynthService } from './synth.service';

const appRoutes: Routes = [
  { path: 'world1', component: WorldComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    HomeComponent,
    KeyboardComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // debug only
    )
  ],
  providers: [
    { provide: Window, useValue: window },
    SynthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
