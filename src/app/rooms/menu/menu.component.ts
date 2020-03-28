import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  uniqueId = '#1234567890';
  playersInRoom = 5;
  constructor() { }

  ngOnInit(): void {
  }

}
