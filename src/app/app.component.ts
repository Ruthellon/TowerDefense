import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IScene } from './Scenes/scene.interface';
import { LevelOneScene } from './Scenes/levelone.scene';
import { Game } from './Utility/game.model';
import { InstructionsScene } from './Scenes/instructions.scene';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements AfterViewInit {
  title = 'TowerDefense';

  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;

  @HostListener('window:resize')
  onResize(): void {
    //this.adjustCanvasSize();
  }

  onMouseMove(e: PointerEvent) {
    if (e.isPrimary) {
      let x = e.offsetX;
      let y = e.offsetY;
      Game.SetMouseLocation(x, y);
    }
  }

  onMouseDown(e: PointerEvent) {
    if (e.isPrimary) {
      Game.SetMouseClick(true);
    }
  }

  onMouseUp(e: PointerEvent) {
    if (e.isPrimary) {
      Game.SetMouseClick(false);
    }
  }

  constructor() {
    Game.AddScenes('instructions', new InstructionsScene());
    Game.AddScenes('levelone', new LevelOneScene());
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasElement.nativeElement;
    this.context = this.canvas.getContext('2d');

    Game.SetCanvasContext(this.context!);

    this.canvas.onpointerdown = this.onMouseDown.bind(this);
    this.canvas.onpointerup = this.onMouseUp.bind(this);
    this.canvas.onpointermove = this.onMouseMove.bind(this);

    this.adjustCanvasSize();

    Game.SetTheScene('instructions');

    this.animate(0);
  }

  private update(deltaTime: number) {
    Game.TheScene.Update(deltaTime);
  }

  private draw(deltaTime: number) {
    if (Game.CONTEXT) {
      Game.CONTEXT.clearRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

      Game.TheScene.Draw(deltaTime);
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

  enableFullscreen(): void {
    // Enable fullscreen mode for the canvas element
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen();
    } else if ((this.canvas as any).webkitRequestFullscreen) {
      (this.canvas as any).webkitRequestFullscreen();
    } else if ((this.canvas as any).msRequestFullscreen) {
      (this.canvas as any).msRequestFullscreen();
    }
  }
}
