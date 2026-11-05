import { Component, OnInit, NgZone } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { trigger, style, animate, transition } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as _moment from 'moment';
import * as AOS from 'aos';
const moment = _moment;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('200ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1, position: "absolute" }),
            animate('160ms ease-out',
              style({ opacity: 0, position: "relative" }))
          ]
        )
      ]
    )
  ]
})

export class AppComponent implements OnInit {
  title = 'CentromedicoCliente';
  isHome: boolean = true;
  isLogin: boolean = false;

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private ngZone: NgZone) {
    moment.locale('es');

    this.isHome = window.location.pathname === '/' || window.location.pathname === '';
    this.isLogin = window.location.pathname.includes('paciente-login');

    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentRoute = event.urlAfterRedirects.split('?')[0];
      this.isHome = currentRoute === '/' || currentRoute === '';
      this.isLogin = currentRoute.includes('paciente-login');

      if (typeof window !== 'undefined' && !window.location.hash) {
        const scrollToTop = () => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        };

        scrollToTop();
        requestAnimationFrame(scrollToTop);
        setTimeout(scrollToTop, 50);
        setTimeout(scrollToTop, 180);
      }

      // Refrescar AOS en cada navegación para que los nuevos componentes se animen sutilmente
      setTimeout(() => {
        this.ngZone.runOutsideAngular(() => {
          AOS.refreshHard();
        });
      }, 120);
    });

    this.matIconRegistry.addSvgIcon(
      "twitter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/twitter.svg")
    ).addSvgIcon(
      "instagram",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/instagram.svg")
    ).addSvgIcon(
      "login",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/login.svg")
    ).addSvgIcon(
      "mail",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/mail.svg")
    ).addSvgIcon(
      "portfolio",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/portfolio.svg")
    ).addSvgIcon(
      "medicals",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/icons/medical-team.svg")
    );
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      // Deshabilitar el cálculo automático prematuro de AOS para controlar el scroll con IntersectionObserver
      AOS.init({
        disable: true
      });
      this.setupScrollReveal();
    });
  }

  private setupScrollReveal() {
    if (typeof window === 'undefined') {
      return;
    }

    const reveal = (el: Element) => {
      el.classList.add('is-revealed');
      el.classList.add('aos-animate');
    };

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-aos], .reveal-on-scroll').forEach(reveal);
      return;
    }

    // El observer SOLO se activa cuando el usuario hace scroll y el elemento entra a la vista
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    });

    const observeElements = () => {
      const elements = document.querySelectorAll('[data-aos], .reveal-on-scroll');
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      elements.forEach(el => {
        if (el.classList.contains('is-revealed') || el.classList.contains('aos-animate')) {
          return;
        }
        const rect = el.getBoundingClientRect();
        // SOLO revelar de inmediato si el elemento ya está visible en la parte superior inicial
        if (rect.top >= 0 && rect.top < viewportHeight * 0.75) {
          reveal(el);
        } else {
          // Si está abajo de la pantalla, esperar a que el usuario haga scroll hacia él
          observer.observe(el);
        }
      });
    };

    // Escanear elementos tras renderizado inicial
    setTimeout(observeElements, 100);
    setTimeout(observeElements, 400);

    // Monitorear inserción dinámica de elementos (navegación Angular y llamadas API)
    if ('MutationObserver' in window) {
      const mutationObserver = new MutationObserver(() => {
        observeElements();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
}
