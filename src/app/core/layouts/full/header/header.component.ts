import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { languages } from '../../../mapData/languages';
import { TranslationService } from '../../../services/translation.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MaterialModule } from '../../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule, TranslateModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  lang: string | null = null
  languages: Array<any> = languages

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) {
    const langStorage = localStorage.getItem('lng')
    this.lang = langStorage ? langStorage : translationService.defaultLang
  }

  changeLang(lang: string) {
    this.translationService.changeLang(lang);
    this.lang = lang
  }
  async logout() {
    this.authService.logout().subscribe({
      next: (resp) => {
        this.authService.exitSystem();
      },
      error: (error:string) => {
        this.authService.exitSystem();
        this.snackbar.error(error);
      },
    })
  }
  goToDeposit() {
    this.router.navigate(['/admin/deposit'])
  }
}

