import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../book';
import { BookService }  from '../book.service';
import { strictEqual } from 'assert';
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getBook();
  }

  getBook(): void {
    var id = this.route.snapshot.paramMap.get('id');
    debugger
    this.bookService.getBook(id)
      .subscribe(hero => this.book = hero);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.bookService.updateBook(this.book)
      .subscribe(() => this.goBack());
  }

}
