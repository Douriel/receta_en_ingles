import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {RouterLink} from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

@Component({
  selector: 'nav-bar',
  imports: [RouterLink, NgbCollapse],
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  readonly isCollapsed = signal(true);
}
