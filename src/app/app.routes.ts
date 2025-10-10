import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ManageComponent } from './manage/manage.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'downloads', component: DownloadsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'glossary', component: GlossaryComponent },
  { path: 'users', component: UsersComponent}
];
