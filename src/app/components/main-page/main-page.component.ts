import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, VideoComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {}
