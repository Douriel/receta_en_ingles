import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

}
