import { Component, OnInit } from '@angular/core';

import {Aid} from '../services/aid/aid.interface';
import {AidService} from '../services/aid/aid.service';

@Component({
  selector: 'app-aid-list',
  templateUrl: './aid-list.component.html',
  styleUrls: ['./aid-list.component.css']
})
export class AidListComponent implements OnInit {
  aids: Aid[] = [];

  constructor(private service: AidService) {
   }

  ngOnInit() {
    this.service.getAids()
            .subscribe(response => {
                this.aids = response;
            });
  }

}
