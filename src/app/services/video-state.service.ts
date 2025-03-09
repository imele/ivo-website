import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoStateService {
  private videoFinished = signal<boolean>(false);
  
  // Expose readonly signal
  readonly videoFinished$ = this.videoFinished.asReadonly();

  setVideoFinished(finished: boolean) {
    this.videoFinished.set(finished);
  }
} 