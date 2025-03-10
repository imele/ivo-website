import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @HostBinding('class.video-finished') isVideoFinished = false;

  projectName = 'Ivo Mele | Software Engineer';
  
  frameworks = [
    { name: 'Angular', icon: 'angular', url: '' },
    { name: 'React', icon: 'react', url: '' },
    { name: 'Flutter', icon: 'flutter', url: '' }
  ];

  constructor(
    private videoStateService: VideoStateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.isVideoFinished = this.videoStateService.videoFinished$();
    
    
    this.iconRegistry.addSvgIcon(
      'angular',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/angular.svg')
    );
    this.iconRegistry.addSvgIcon(
      'react',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/react.svg')
    );
    this.iconRegistry.addSvgIcon(
      'flutter',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/flutter.svg')
    );
  }
}
