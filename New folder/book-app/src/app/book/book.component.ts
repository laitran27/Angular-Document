import { Component, OnInit } from "@angular/core";
import { BookService } from "../book.service";


@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.css"]
})
export class BookComponent implements OnInit {
  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.getBooks()
  }

  getBooks() {
    this.bookService.getBooks().subscribe(data => console.log(data));
  }
}
