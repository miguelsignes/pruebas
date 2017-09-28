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



  rcArray:any;
  recetas:any;
  recetas_cargadas:any[]= [];
  favoritos_cargados:any[] = [];
  profile_recetas:any;

  constructor( private http:Http) {
    this.getHistorial();

    this.recetas = new Map();


   }
  getHistorial() {

      this.http.get('assets/data/historial.json')
      .map( response => response.json())
      .subscribe(
        data => {
        
  
        this.recetas_cargadas = data;
        
        for (var i = 0; i < this.recetas_cargadas.length; i++)
        {
          this.recetas.set(this.recetas_cargadas[i].id, {slug:this.recetas_cargadas[i].slug, historial:true})
        }
        console.log("recetas historial " + this.recetas )
        this.getFavoritos();        //  this.recetas.set()
        },
        error => {

        });
 }

 getFavoritos() {
  this.http.get('assets/data/favoritos.json')
  .map( response => response.json())
  .subscribe(
    data => {
    
  
    this.favoritos_cargados = data;
    
    for (var i = 0; i < this.favoritos_cargados.length; i++)
    {
      if ( this.recetas.has(this.favoritos_cargados[i].id) )
      {
        console.log("encontrado " + this.favoritos_cargados[i].id);
        this.recetas.set(this.favoritos_cargados[i].id, {slug:this.recetas_cargadas[i].slug, historial:true, favoritos:true})
      }
    }
   
    console.log("recetas " + this.profile_recetas);
    console.log(this.recetas);       
   
    this.rcArray = this.recetas;
   
    const arr = Array.from(this.recetas, ([key, val]) => {
      return {type: key, name: val};
    });
    console.log(arr);
    this.rcArray = arr;

    },
    error => {

    });
 }

 containsKey(key: string) {
  if (typeof this[key] === "undefined") {
      return false;
  }

  return true;
}

  ngOnInit() {
  }



   strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    console.log(obj);
    return obj;
    
  }
}
