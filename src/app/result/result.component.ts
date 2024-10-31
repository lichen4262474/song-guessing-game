import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"],
})
export class ResultComponent implements OnInit {
  @Input() score: number = 0;
  name: string = "";
  @Output() nameEmitter = new EventEmitter<string>();
  @Output() restartEmitter = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  OnClick() {
    this.nameEmitter.emit(this.name);
    this.restartEmitter.emit(true);
  }
}
