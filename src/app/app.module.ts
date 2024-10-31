import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ConfigComponent } from "./config/config.component";
import { GameComponent } from "./game/game.component";
import { RandomizePipe } from "./randomize.pipe";
import { ResultComponent } from './result/result.component';

const routes: Routes = [{ path: "", component: HomeComponent }];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfigComponent,
    GameComponent,
    RandomizePipe,
    ResultComponent,
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
