import { Component, Input, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";
localStorage.setItem(
  "whos-who-access-token",
  JSON.stringify({
    value:
      "BQDs22uuMhJlhDxjNI0g_9mJAWOIvAv5lMoZbZKdGjc6ukQuyVpSYpE6s_SsO4bok3QM1gICSpsPL3yhGgftZT4ogsTtnDZUUS13sMRT3zijyrwW9pU",
    expiration: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
  })
);

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  tracks: any[] = [];
  albums: any[] = [];
  @Input() albumId: string = "";
  @Input() artistName: string = "";
  showConfig: boolean = true;
  showGame: boolean = false;
  showResult: boolean = false;
  score: number = 0;
  name: string = "";
  leaderboard: { score: number; name: string }[] = [];
  constructor() {}

  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;

    // #################################################################################
    // DEPRECATED!!! Use only for example purposes
    // DO NOT USE the recommendations endpoint in your application
    // Has been known to cause 429 errors
    // const response = await fetchFromSpotify({
    //   token: t,
    //   endpoint: "recommendations/available-genre-seeds",
    // });
    // console.log(response);
    // #################################################################################

    this.genres = [
      "rock",
      "rap",
      "pop",
      "country",
      "hip-hop",
      "jazz",
      "alternative",
      "j-pop",
      "k-pop",
      "emo",
    ];
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
  }

  // receive artist name from config component
  async artistHandler(artist: string) {
    this.artistName = artist;
    const artistId = await this.fetchArtistId(this.artistName);
    if (artistId) {
      this.albums = await this.fetchAlbumsByArtist(artistId);
    } else {
      console.error("Could not fetch artist ID");
    }
  }

  //load game

  //receive album name from config component
  async albumHandler(albumId: string) {
    this.albumId = albumId;
    await this.fetchTracks(albumId);
    this.showGame = true;
    this.showConfig = false;
  }

  //receive user score from the game component
  scoreHandler(score: number) {
    this.score = score;
    this.showResult = true;
    this.showGame = false;
  }

  // receive user name from the result component
  nameHandler(name: string) {
    this.name = name;
    this.leaderboard.push({ score: this.score, name: this.name });
    this.leaderboard.sort((a, b) => b.score - a.score);
    console.log("User name received. leaderboard info: ", this.leaderboard);
  }

  //receive restart game from the game component. In case of empty track preview, the game will restart.
  restartHandler(restart: boolean) {
    if (restart) {
      this.showConfig = true;
      this.showGame = false;
      this.showResult = false;
      this.tracks = [];
      this.albums = [];
      this.score = 0;
    }
  }

  // Fetch artist ID by name
  // Spotify doc: https://developer.spotify.com/documentation/web-api/reference/search
  private async fetchArtistId(artistName: string): Promise<string | null> {
    const artistResponse = await fetchFromSpotify({
      token: this.token,
      endpoint: "search",
      params: {
        q: artistName,
        type: "artist",
        limit: 1,
      },
    });
    const artistId =
      artistResponse.artists.items.length > 0
        ? artistResponse.artists.items[0].id
        : null;
    if (!artistId) {
      console.error("Artist not found");
    }
    console.log("Artist found ID: ", artistId);
    return artistId;
  }

  //fetch albums by the artist
  private async fetchAlbumsByArtist(artistId: string) {
    try {
      const albumsResponse = await fetchFromSpotify({
        token: this.token,
        endpoint: `artists/${artistId}/albums`,
      });
      const albums = albumsResponse.items;
      if (albums.length === 0) {
        console.log("No albums found for this artist.");
      } else {
        console.log("Albums found:", albums);
      }
      return albums;
    } catch (error) {
      console.error("Error fetching albums:", error);
      return [];
    }
  }

  // Fetch tracks by album ID
  private async fetchTracks(albumId: string) {
    const tracksResponse = await fetchFromSpotify({
      token: this.token,
      endpoint: `albums/${albumId}/tracks`,
      params: {
        limit: 5,
      },
    });
    this.tracks = tracksResponse.items;
    console.log("Tracks found:", this.tracks);
  }
}
