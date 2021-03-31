import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoresPage } from './stores.page';

const routes: Routes = [
  {
    path: '',
    component: StoresPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule {}
