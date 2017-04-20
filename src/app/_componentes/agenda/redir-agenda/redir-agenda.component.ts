import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-redir-agenda',
  templateUrl: './redir-agenda.component.html',
  styleUrls: ['./redir-agenda.component.css']
})
export class RedirAgendaComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.router.navigate(['/agenda/' + params['fecha']]);
    });
  }

}
