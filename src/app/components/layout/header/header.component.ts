import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NAV_ITEMS } from './constants/nav-items';
import { AuthService } from '../../../core/services/auth.service';
import { TUser } from '../../../shared/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  menuItems = NAV_ITEMS;
  showPopover = false;
  showMobileMenu = false;
  user: TUser | null = null;

  ngOnInit(): void {
    this.getUserInfo();
  }

  togglePopover() {
    this.showPopover = !this.showPopover;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  getUserInfo(): void {
    this.userService.getUserInfo().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }
}
