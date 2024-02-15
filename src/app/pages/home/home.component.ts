import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { app, manage } from '../../constant/dashboard-menu';
import { LucideAngularComponent, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  apps = app;
  manages = manage;
}
