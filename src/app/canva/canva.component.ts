import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss']
})
export class CanvaComponent implements AfterViewInit {
  @ViewChild('canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvas2')
  private canvas2!: ElementRef<HTMLCanvasElement>;


  public url: string = 'https://firebasestorage.googleapis.com/v0/b/e-buddy-enterprise.appspot.com/o/entity%2FPOuTSqUUiHyI3PVnLAEq%2Fprojects%2Fx3J0ey1R8tzQymCBFpPO%2FHZbdfZBdvsW5PbIiCPXS%2Fvideo%2F1648728952031-yt1s.com%20-%20Pixies%20%20Where%20Is%20My%20Mind.mp4?alt=media&token=703af7e2-e3b8-4115-bb15-ef848e8c6e8a'
  public savedCanvas: string;

  ngAfterViewInit(): void {
    fabric.Image.prototype.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          video_src: 'https://firebasestorage.googleapis.com/v0/b/e-buddy-enterprise.appspot.com/o/entity%2FPOuTSqUUiHyI3PVnLAEq%2Fprojects%2Fx3J0ey1R8tzQymCBFpPO%2FHZbdfZBdvsW5PbIiCPXS%2Fvideo%2F1648728952031-yt1s.com%20-%20Pixies%20%20Where%20Is%20My%20Mind.mp4?alt=media&token=703af7e2-e3b8-4115-bb15-ef848e8c6e8a'
        });
      };
    })(fabric.Image.prototype.toObject);


    // create a wrapper around native canvas element (with id="c")
    let fabricCanvas = new fabric.Canvas(this.canvas.nativeElement, {
      height: 300,
      width: 800,
    });

    let videoElement = this.getVideoElement(this.url);
    let fabricVideo = new fabric.Image(videoElement, { left: 0, top: 0 });

    fabricCanvas.add(fabricVideo);
    (fabricVideo.getElement() as HTMLVideoElement).play();

    fabric.util.requestAnimFrame(function render() {
      fabricCanvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
    this.savedCanvas = fabricCanvas.toJSON();
    this.renderCanvas();
  }

  public getVideoElement(url): HTMLVideoElement {
    var videoE = document.createElement('video');
    videoE.width = 530;
    videoE.height = 298;
    videoE.muted = true;
    videoE.crossOrigin = "anonymous";
    var source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    videoE.appendChild(source);
    return videoE;
  }


  public renderCanvas() {
    let canvas = new fabric.Canvas(this.canvas2.nativeElement, {
      height: 300,
      width: 800,
    });
    canvas.loadFromJSON(JSON.stringify(this.savedCanvas), () => {
      canvas.renderAll.bind(canvas);
      var objs = this.savedCanvas['objects'];
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].hasOwnProperty('video_src')) {
          var videoE = this.getVideoElement(objs[i]['video_src']);
          var fab_video = new fabric.Image(videoE, { left: objs[i]['left'], top: objs[i]['top'] });
          canvas.add(fab_video);
          (fab_video.getElement() as HTMLVideoElement).play();
          fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
          });
        }
      }
    });
  }
}

