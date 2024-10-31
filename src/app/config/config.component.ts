import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.css"],
})
export class ConfigComponent implements OnInit {
  artistName: string = "";
  albumId: string = "";
  @Input() albums: any[] = [];
  @Output() artistEmitter = new EventEmitter<string>();
  @Output() albumEmitter = new EventEmitter<string>();

  onArtistChange() {
    this.artistEmitter.emit(this.artistName);
  }

  ngOnInit(): void {}

  OnSubmit() {
    this.albumEmitter.emit(this.albumId);
  }
}
