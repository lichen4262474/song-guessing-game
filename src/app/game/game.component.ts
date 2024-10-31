import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  @Output() scoreEmitter = new EventEmitter<number>();
  @Input() tracks: any[] = [];
  options: string[] = [];
  trackIndex: number = 0;
  trackPreview: any;
  userScore: number = 0;
  correct: boolean = false;
  wrong: boolean = false;
  nextQuestion: boolean = false;
  buttonDisabled: boolean = false;
  selectedOption: string = "";
  seeResult: boolean = false;
  @Output() restartEmitter = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {
    this.loadQuestion();
  }
  loadQuestion() {
    this.options = this.tracks.map((track) => track.name);
    this.trackPreview = this.tracks[this.trackIndex].preview_url;
    this.correct = false;
    this.wrong = false;
    this.selectedOption = "";
    this.nextQuestion = false;
    if (!this.trackPreview) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }
    console.log("Loaded question with trackIndex:", this.trackIndex);
    console.log("Loaded question with track preview:", this.trackPreview);
  }

  checkAnswer(selectedOption: string) {
    if (selectedOption == this.tracks[this.trackIndex].name) {
      this.userScore++;
      this.correct = true;
      console.log("User answer it correctly. Current score: ", this.userScore);
    } else {
      this.wrong = true;
      console.log("User answer it wrong. Current score: ", this.userScore);
    }
    this.nextQuestion = true;
    this.buttonDisabled = true;
  }

  nextTrack(audioPlayer: HTMLAudioElement) {
    if (this.trackIndex < this.tracks.length - 1) {
      this.trackIndex++;
      this.loadQuestion();
      audioPlayer.load();
    } else {
      console.log("End of the quiz");
      this.nextQuestion = false;
      this.seeResult = true;
    }
  }
  // emit score to home component
  showResult() {
    this.scoreEmitter.emit(this.userScore);
  }
  // go back to config page if no track is available in the album
  goBack() {
    this.restartEmitter.emit(true);
  }
}
