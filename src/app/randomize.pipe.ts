import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "randomize",
})
export class RandomizePipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array; // Return as is if not an array
    }

    // Create a copy of the array and shuffle it
    const shuffledArray = [...array].sort(() => Math.random() - 0.5);
    return shuffledArray;
  }
}
