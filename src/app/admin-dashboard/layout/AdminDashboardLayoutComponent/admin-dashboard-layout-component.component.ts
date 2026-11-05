import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout-component',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './admin-dashboard-layout-component.component.html',
})
export class AdminDashboardLayoutComponentComponent {

  authService = inject(AuthService);
  router = inject(Router)
  user = computed(()=>this.authService.user());

  logOut(){
    this.authService.logout();
    this.router.navigateByUrl('/auth/login')
  }

}
