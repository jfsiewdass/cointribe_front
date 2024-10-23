import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { TranslationService } from '../../../services/translation.service';
import { languages } from '../../../mapData/languages';

@Component({
  selector: 'app-header-auth',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule],
  templateUrl: './header-auth.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderAuthComponent {
  lang: string | null = null
  languages: Array<any> = languages
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(private translationService: TranslationService) {
    this.lang = translationService.defaultLang
  }

  changeLang(lang: string) {
    this.translationService.changeLang(lang);
    this.lang = lang
  }
}

