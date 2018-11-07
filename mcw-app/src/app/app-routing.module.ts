import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldComponent } from './world.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: 'world1', component: WorldComponent },
  { path: '', component: HomeComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
