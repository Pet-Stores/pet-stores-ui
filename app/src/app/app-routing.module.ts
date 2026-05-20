import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { DesignSystemComponent } from './components/design-system/design-system.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'design-system', component: DesignSystemComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
