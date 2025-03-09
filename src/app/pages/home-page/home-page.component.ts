import { Component } from '@angular/core';
import { MainPageComponent } from "@app/components/main-page/main-page.component";
import { FooterComponent } from "@app/components/footer/footer.component";
import { HeaderComponent } from "@app/components/header/header.component";

@Component({
  selector: 'app-home-page',
  imports: [MainPageComponent, HeaderComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
