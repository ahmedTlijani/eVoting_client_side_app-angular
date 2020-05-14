import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  image_src: any;

  constructor(public dialogRef: MatDialogRef<ImageViewerComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private _sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log("img src", this.data);
    this.image_src = this._sanitizer.bypassSecurityTrustResourceUrl(this.data);
  }

}
