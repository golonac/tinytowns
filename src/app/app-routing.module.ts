import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TinyTownsComponent } from './tiny-towns.component'

const routes: Routes = [
  { path: '', component: TinyTownsComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
