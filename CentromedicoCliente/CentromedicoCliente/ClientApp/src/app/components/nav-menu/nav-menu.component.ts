import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css', './mobile-menu.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  userName: string;
  userRole: string;
  isMenuOpen = false;

  private routerSub: Subscription;
  currentUserName$ = this.accountSvc.currentUserName;
  currentUserRole$ = this.accountSvc.currentUserRole;

  constructor(private accountSvc: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.currentUserName$.subscribe(r => {
      this.userName = r;
    });

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });
  }

  get isLoginRoute(): boolean {
    return this.router.url.includes('/paciente-login');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
  }

  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.updateBodyScroll();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 1000) {
      this.closeMenu();
    }
  }

  private updateBodyScroll(): void {
    if (typeof document !== 'undefined') {
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  logOut(): void {
    this.closeMenu();
    this.accountSvc.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
