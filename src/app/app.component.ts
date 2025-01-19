import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/token.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  title = 'Cloudonix Store';
  tokenService = inject(TokenService);
  userAuth = false;
  isLoginPage2 = computed(() => this.router.url === '/auth');

  show = false;
  toggleChild() {
    this.show = !this.show;
  }
  onChange(e: any) {
    this.title = e?.target?.value;
  }

  ngOnInit(): void {
    this.userAuth = this.tokenService.isTokenized();
  }

  private router = inject(Router);

  isLoginPage(): boolean {
    return this.router.url === '/auth';
  }
}
