import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'home',
  imports: [RouterLink, NavBarComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
