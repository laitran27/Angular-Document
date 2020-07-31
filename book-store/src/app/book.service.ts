import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Book } from './book';
import { Observable, of } from 'rxjs';

import { MessageService } from "./message.service";
@Injectable({
  providedIn: "root"
})
export class BookService {
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  private BooksUrl = `https://localhost:44354/api/Books`;

  constructor(private http: HttpClient,private messageService: MessageService) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.BooksUrl, this.httpOptions);
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

  searchBooks(term: string): Observable<Book[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Book[]>(`${this.BooksUrl}/?name=${term}`).pipe(
      tap(x =>
        x.length
          ? this.log(`found books matching "${term}"`)
          : this.log(`no books matching "${term}"`)
      ),
      catchError(this.handleError<Book[]>("searchBooks", []))
    );
  }
  getBook(bookID: string): Observable<Book> {
    // this.messageService.add('HeroService: fetched hero id=' + id);
    // return of(books.find(hero => hero.id === id));
    const url = `${this.BooksUrl}/${bookID}`;
    return this.http.get<Book>(url).pipe(
      tap(_ => this.log(`fetched book id = ${bookID}`)),
      catchError(this.handleError<Book>(`getBook id = ${bookID}`))
    );
  }

  updateBook(book: Book): Observable<any> {
    debugger
    const id = typeof book === "string" ? book : book.bookID;
    const url = `${this.BooksUrl}/${id}`;
    return this.http.put(url, book, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${book.bookID}`)),
      catchError(this.handleError<any>("updateBook"))
    );
  }

  deleteBook(hero: Book | string): Observable<Book> {
    const id = typeof hero === "string" ? hero : hero.bookID;
    const url = `${this.BooksUrl}/${id}`;

    return this.http.delete<Book>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted book id=${id}`)),
      catchError(this.handleError<Book>("deleteBook"))
    );
  }
  addHero (book: Book): Observable<Book> {
    return this.http.post<Book>(this.BooksUrl, book, this.httpOptions).pipe(
      tap((newbook: Book) => this.log(`added hero w/ id=${newbook.bookID}`)),
      catchError(this.handleError<Book>('addHero'))
    );
  }
}
