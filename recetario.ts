import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-recetario',
  templateUrl: './recetario.component.html',
  styleUrls: ['./recetario.component.css']
})
export class RecetarioComponent implements OnInit {


  categorias:any;
  cat1: any;
  cat2: any;
  cat3: any;
  idsCall:any[] = [];
  ls:any[] = [];

  constructor( private http:Http, private router:ActivatedRoute) 
      {

        this.verCategorias();
   }

 multiplesCalls() {
    for ( let i = 0; i < this.categorias.length; i++)
        {
      this.idsCall.push(this.categorias[i].id);
       }
       console.log(this.idsCall);

       let character = this.http.get('assets/data/1.json').map(res => res.json());
       let characterHomeworld = this.http.get('assets/data/2.json').map(res => res.json()); 
       Observable.forkJoin([character, characterHomeworld])
       .subscribe( results => {
      console.log(results);
      this.ls.push(results);
      this.cat1 = results[0];
      this.cat2 = results[1];

      console.log("ls " + this.ls);
      localStorage.setItem('cc',JSON.stringify(this.ls));
      
       })
 }
  
 verCategorias() {

  this.http.get('assets/data/categorias.json')
  .map(res => res.json())
  .subscribe(
    data => {
      this.categorias = data;
      console.log(data);
      this.multiplesCalls();

    }
  )

 }

  ngOnInit() {
  }

}
