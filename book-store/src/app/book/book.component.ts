import { Component, OnInit } from '@angular/core';
import { Book } from "../book";
import { BookService } from "../book.service";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books: Book[];

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.getBook();
  }
  getBook(): void {
    this.bookService.getBooks()
    //.subscribe(data => {console.log(data)});
    .subscribe(data => {this.books = data});
  }

  delete(book: Book): void {
    this.books = this.books.filter(h => h !== book);
    this.bookService.deleteBook(book).subscribe();
  }

  add(bookID: string,bookName:string,price:number,author:string,category: string): void{
    debugger
    bookName = bookName.trim();
    price =  parseFloat(price.toString());
    if(!bookName) {return;}
    this.bookService.addHero({bookID,bookName,price,author,category} as Book)
      .subscribe(book=>{
        this.books.push(book);
      });
    }
}
