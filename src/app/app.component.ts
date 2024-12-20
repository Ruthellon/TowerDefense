import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Game } from './Utility/game.model';
import { IAngryElfAPIService } from './Services/angryelfapi.service.interface';
import { version } from '../../package.json'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements AfterViewInit {
  title = 'TowerDefense';
  version = version;

  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;
  private previousWidth: number = 0;
  private previousHeight: number = 0;

  onResize(): void {
    if (this.canvas &&
      (this.canvas.offsetWidth !== this.previousWidth || this.canvas.offsetHeight !== this.previousHeight)) {
      
      this.multiplierX = this.canvas.offsetWidth / Game.CANVAS_WIDTH;
      this.multiplierY = this.canvas.offsetHeight / Game.CANVAS_HEIGHT;

      this.previousWidth = this.canvas.offsetWidth;
      this.previousHeight = this.canvas.offsetHeight;
    }
  }

  private multiplierX = 1;
  private multiplierY = 1;
  onMouseMove(e: PointerEvent) {
    if (e.isPrimary) {
      let x = e.offsetX / this.multiplierX;
      let y = e.offsetY / this.multiplierY;
      Game.SetMouseLocation(x, y);
    }
  }

  onMouseDown(e: PointerEvent) {
    if (e.isPrimary) {
      let x = e.offsetX / this.multiplierX;
      let y = e.offsetY / this.multiplierY;
      Game.SetMouseLocation(x, y);
      Game.SetMouseClick(true);
    }
  }

  onMouseUp(e: PointerEvent) {
    if (e.isPrimary) {
      let x = e.offsetX / this.multiplierX;
      let y = e.offsetY / this.multiplierY;
      Game.SetMouseLocation(x, y);
      Game.SetMouseClick(false);
    }
  }

  constructor(private api: IAngryElfAPIService) {

  }

  private initialWidth = 0;
  ngAfterViewInit(): void {
    this.canvas = this.canvasElement.nativeElement;
    this.context = this.canvas.getContext('2d');

    Game.SetCanvasContext(this.context!);

    this.canvas.onpointerdown = this.onMouseDown.bind(this);
    this.canvas.onpointerup = this.onMouseUp.bind(this);
    this.canvas.onpointermove = this.onMouseMove.bind(this);

    this.initialWidth = this.canvas.offsetWidth;

    this.adjustCanvasSize();

    Game.SetTheAPI(this.api);
    Game.SetTheScene('instructions');
    Game.SetStartingCredits(50);

    this.animate(0);
  }

  private update(deltaTime: number) {
    Game.TheScene.Update(deltaTime);
  }

  private draw(deltaTime: number) {
    if (Game.CONTEXT) {
      Game.CONTEXT.clearRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

      Game.TheScene.Draw(deltaTime);

      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '18px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`FPS: ${this.fps.toFixed(0).padStart(3, '0')}`, 50, 25);
      Game.CONTEXT.fillText(`V: ${this.version}`, 50, 50);
    }
  }

  private adjustCanvasSize(): void {
    // Match canvas size to its display size
    this.canvas.width = Game.CANVAS_WIDTH;
    this.canvas.height = Game.CANVAS_HEIGHT;
  }

  private animationFrameId: number | undefined;
  private lastTime = 100;
  private lastFPSTime = 0;
  private maxFPS = 120;
  private maxPeriod = 1000 / this.maxFPS;
  fps: number = 120;
  fpsAverage: number = 120;
  private animate(currentTime: number) {
    let deltaTime = (currentTime - this.lastTime);

    this.onResize();
    
    if (Math.floor(deltaTime) >= Math.floor(this.maxPeriod)) {
      this.lastTime = currentTime;

      this.fpsAverage += (1000 / deltaTime);
      this.fpsAverage /= 2;

      if ((currentTime - this.lastFPSTime) > 500) {
        this.fps = this.fpsAverage;
        this.lastFPSTime = currentTime;
      }

      this.update((deltaTime / 1000));
      this.draw((deltaTime / 1000));
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  private inFullScreen: boolean = false;
  enableFullscreen(): void {
    // Enable fullscreen mode for the canvas element
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen();
    } else if ((this.canvas as any).webkitRequestFullscreen) {
      (this.canvas as any).webkitRequestFullscreen();
    } else if ((this.canvas as any).msRequestFullscreen) {
      (this.canvas as any).msRequestFullscreen();
    }
    this.inFullScreen = true;
  }
}
