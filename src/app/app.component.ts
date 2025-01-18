import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/token.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cloudonix-store';
  tokenService = inject(TokenService);
  userAuth = false;

  ngOnInit(): void {
    this.userAuth = this.tokenService.isTokenized();
  }

  private router = inject(Router);

  isLoginPage(): boolean {
    return this.router.url === '/auth';
  }
}
