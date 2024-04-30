import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvesigadoresComponent } from './investigadores/invesigadores.component';
import { MenuComponent } from './menu.component';

const routes: Routes = [
  {path:'', component: MenuComponent, children:
  [{path:'investigadores',component:InvesigadoresComponent },
]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { 
  
}
