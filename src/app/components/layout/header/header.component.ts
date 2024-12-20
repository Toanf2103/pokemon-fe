import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NAV_ITEMS } from './constants/nav-items';
import { AuthService } from '../../../core/services/auth.service';
import { TUser } from '../../../shared/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';

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
    private userService: UserService,
    private router: Router
  ) {}
  menuItems = NAV_ITEMS;
  showPopover = false;
  showMobileMenu = false;
  user: TUser | null = null;

  ngOnInit(): void {
    this.checkAuthAndFetchUserInfo();

    this.authService.getLoginStatus().subscribe(() => {
      this.getUserInfo(); // Gọi lại hàm getUserInfo khi người dùng đăng nhập
    });
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

  checkAuthAndFetchUserInfo(): void {
    if (this.authService.isLoggedIn()) {  // Kiểm tra nếu người dùng đã đăng nhập
      this.getUserInfo();
    } else {
      this.router.navigate(['/login']);  // Điều hướng về trang đăng nhập nếu chưa đăng nhập
    }
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
