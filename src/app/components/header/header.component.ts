import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @HostBinding('class.video-finished') isVideoFinished = false;

  projectName = 'Ivo Mele | Software Engineer'; // You can change this to your actual project name

  constructor(private videoStateService: VideoStateService) {
    this.isVideoFinished = this.videoStateService.videoFinished$();
  }
}
