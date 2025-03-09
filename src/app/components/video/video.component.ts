import { Component, ElementRef, ViewChild, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  isVideoLoaded = false;
  showWelcomeText = false;
  welcomeText = '';
  
  private readonly SMOOTHING_FACTOR = 0.15;
  private readonly FULL_WELCOME_TEXT = 'Welcome to my website';
  private readonly TEXT_START_TIME = 3;
  
  private scrollListener: (() => void) | null = null;
  private lastScrollPosition = 0;
  private scrollTimeout: any;
  private isPlaying = false;
  private requestAnimationFrame: number | null = null;
  private targetTime = 0;
  private isAtBottom = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private videoStateService: VideoStateService
  ) {}

  ngOnInit(): void {
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  onVideoLoaded(): void {
    this.isVideoLoaded = true;
  }

  private setupScrollListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = () => this.handleScroll();
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    }
  }

  private cleanupResources(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    
    if (this.requestAnimationFrame) {
      cancelAnimationFrame(this.requestAnimationFrame);
    }
    
    clearTimeout(this.scrollTimeout);
    this.videoStateService.setVideoFinished(false);
  }

  private handleScroll(): void {
    if (!this.videoElement?.nativeElement) return;

    if (this.requestAnimationFrame) {
      cancelAnimationFrame(this.requestAnimationFrame);
    }

    this.requestAnimationFrame = requestAnimationFrame(() => {
      this.updateVideoPlayback();
    });
  }

  private updateVideoPlayback(): void {
    const video = this.videoElement.nativeElement;
    const videoHeight = video.duration * 1000;
    const currentScroll = window.scrollY;
    
    this.checkIfAtBottom(currentScroll);
    clearTimeout(this.scrollTimeout);

    this.updateVideoTime(video, videoHeight, currentScroll);
    this.updateWelcomeText(video.currentTime);
    this.handleVideoPlayback(video, currentScroll);
    
    this.lastScrollPosition = currentScroll;
    this.scheduleNextUpdate(video);
    this.checkVideoFinished(video);
  }

  private checkIfAtBottom(currentScroll: number): void {
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    this.isAtBottom = (windowHeight + currentScroll) >= scrollHeight - 50;
  }

  private updateVideoTime(video: HTMLVideoElement, videoHeight: number, currentScroll: number): void {
    const scrollProgress = Math.max(0, Math.min(currentScroll / videoHeight, 1));
    this.targetTime = video.duration * scrollProgress;
    
    if (this.isAtBottom) {
      video.currentTime = video.duration - 0.1;
    } else {
      const timeDiff = this.targetTime - video.currentTime;
      const adaptiveFactor = Math.min(this.SMOOTHING_FACTOR * (1 + Math.abs(timeDiff)), 0.5);
      video.currentTime = video.currentTime + (timeDiff * adaptiveFactor);
    }
  }

  private handleVideoPlayback(video: HTMLVideoElement, currentScroll: number): void {
    if (currentScroll !== this.lastScrollPosition && !this.isPlaying && !this.isAtBottom) {
      this.isPlaying = true;
      video.playbackRate = 1;
      video.play().catch(() => {
        this.isPlaying = false;
      });
    }
  }

  private scheduleNextUpdate(video: HTMLVideoElement): void {
    if (!this.isAtBottom && Math.abs(this.targetTime - video.currentTime) > 0.01) {
      this.requestAnimationFrame = requestAnimationFrame(() => this.handleScroll());
    } else {
      this.scrollTimeout = setTimeout(() => {
        if (this.isPlaying) {
          video.pause();
          this.isPlaying = false;
        }
      }, 150);
    }
  }

  private checkVideoFinished(video: HTMLVideoElement): void {
    if (video.currentTime >= video.duration - 0.1 || this.isAtBottom) {
      this.videoStateService.setVideoFinished(true);
      
      if (!this.isAtBottom) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }
    } else {
      this.videoStateService.setVideoFinished(false);
    }
  }

  private updateWelcomeText(currentTime: number): void {
    console.log('Current video time:', currentTime);
    
    if (currentTime >= this.TEXT_START_TIME) {
      this.showWelcomeText = true;
      
      const timeAfterStart = currentTime - this.TEXT_START_TIME;
      const charsToShow = Math.min(
        Math.floor(timeAfterStart / 0.1), 
        this.FULL_WELCOME_TEXT.length
      );
      
      this.welcomeText = this.FULL_WELCOME_TEXT.substring(0, charsToShow);
      console.log('Welcome text:', this.welcomeText, 'Visible:', this.showWelcomeText);
    } else {
      this.showWelcomeText = false;
      this.welcomeText = '';
    }
  }
} 