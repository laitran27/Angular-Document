import { Component, OnInit } from "@angular/core";
import { Book } from "../hero";
//import { HEROES } from "../mock-heroes";
import { HeroService } from "../hero.service";
import { MessageService } from "../message.service";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit {
  heroes: Book[];
  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getBooks().subscribe(data => {
      debugger;
      this.heroes = data;
    });
  }
  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    // this.heroService.addHero({BookName} as Book)
    //   .subscribe(hero=>{
    //     this.heroes.push(hero);
    //   });
  }
  delete(hero: Book): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
