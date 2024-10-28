import { Component, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderAuthComponent } from './header/header-auth.component';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: [],
  standalone: true,
  imports: [RouterOutlet, MaterialModule, CommonModule, HeaderAuthComponent],
})
export class BlankComponent {
  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | any;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  get isOver(): boolean {
    return this.isMobileScreen;
  }
  toggleCollapsed() {
    this.isContentWidthFixed = false;
  }
}
