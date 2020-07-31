import { Injectable } from "@angular/core";
//import { HEROES } from "./mock-heroes";
import { Book } from "./hero";
import { Observable, of } from "rxjs";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HeroService {
  private heroesUrl = "https://localhost:44354/api/Books";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
   //this.getHeroes();
  }
  getBooks(): Observable<any> {
    return this.http.get<any>(`https://localhost:44354/api/Books`)
  }


  getHeroes(): Observable<any> {
    return this.http.get<any>(this.heroesUrl,this.httpOptions)
  }

  getHeroNo404<Data>(id: string): Observable<Book> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Book[]>(url).pipe(
      map(heroes => heroes[0]), // returns a {0|1} element array
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<Book>(`getHero id=${id}`))
    );
  }

  getHero(id: number): Observable<Book> {
    // this.messageService.add('HeroService: fetched hero id=' + id);
    // return of(HEROES.find(hero => hero.id === id));
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Book>(url).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Book>(`getHero id = ${id}`))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  updateHero(hero: Book): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.BookID}`)),
      catchError(this.handleError<any>("updateHero"))
    );
  }

  addHero(hero: Book): Observable<Book> {
    return this.http.post<Book>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Book) => this.log(`add hero w/ id=${newHero.BookID}`)),
      catchError(this.handleError<Book>("addHero"))
    );
  }

  deleteHero(hero: Book | string): Observable<Book> {
    const id = typeof hero === "string" ? hero : hero.BookID;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Book>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Book>("deleteHero"))
    );
  }
  searchHeroes(term: string): Observable<Book[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Book[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Book[]>("searchHeroes", []))
    );
  }
}
