import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  debounceTime,
  distinctUntilChanged } from 'rxjs/operators';

import { CountriesService } from './countries.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  // Las animaciones se definen en el metadato 'animations'
  // del decorador 'Component'.
  animations: [
    // Una animación consta de un 'trigger': debemos enlazarlo
    // en el elemento HTML del template que queramos animar.
    trigger('searchInput', [
      // El 'trigger' consta de estados. Se definen con 'state' y
      // representan los keyframes de la animación. Es decir, puntos
      // clave de la animación que definen los estilos que se verán
      // afectados. Estos estilos se establecen con 'style'.
      state('hidden', style({
        'transform': 'translateX(100%)',
        'opacity': 0
      })),
      state('shown', style({
        'transform': 'translateX(0%)',
        'opacity': 1,
      })),
      // Con 'transition' indicamos el comportamiento de una animación
      // entre dos estados. Para indicar el origen y destino de los
      // estados utilizamos flechas de dirección:
      //    A => B define la animación del estado A al estado B.
      //    A <= B define la animación del estado B al estado A.
      //    A <=> B define la animación en doble sentido entre A y B.
      // Seguidamente, con 'animate' configuramos el tiempo de la
      // animación y la función que define su curva de aceleración.
      transition(
        'hidden <=> shown',
        animate('600ms cubic-bezier(0.77, 0, 0.175, 1)')
      )
    ])
  ]
})
export class AppComponent implements OnInit {

  searchBox = new FormControl();
  countries$: Observable<any>;
  searchInputAnimationState = 'hidden';

  constructor(private _countriesService: CountriesService) { }

  ngOnInit(): void {

    // Los objetos 'FormControl' tienen una propiedad 'valueChanges' que es
    // un observable que emite valores cuando el input asociado cambia.
    // Precisamente, el valor que emite es el texto del input.
    this.countries$ = this.searchBox
      .valueChanges
      // Podemos hacer pasar un flujo de datos (observable) por un pipeline
      // de transformaciones. Lo hacemos con la función 'pipe()' del observable,
      // la cual espera uno o más operadores de transformación.
      .pipe(
        // 1) Con 'debounceTime()' hacemos una pausa antes de emitir el
        // valor al siguiente paso del pipeline.
        debounceTime(400),
        // 2) Con 'distinctUntilChanged()' comprobamos que el valor que debemos
        // emitir no sea el mismo que el último emitido. En tal caso, no
        // emite el valor al siguiente paso del pipeline.
        distinctUntilChanged(),
        // 3) Con 'swtichMap()' transformamos flujos de datos de un tipo 'x' a
        // un tipo 'y'. En este caso, transformaos un flujo de cadenas de texto,
        // correspondientes al valor del input, a un flujo de objetos JSON de
        // tipo 'country' que rescogemos del servidor a través del servicio.
        switchMap((value: string) => {
          return this._countriesService.searchCountries(value);
        })
      );
  }

  toggleSearchInputAnimationState(): void {
    this.searchInputAnimationState = this.searchInputAnimationState === 'hidden' ? 'shown' : 'hidden';
  }
}
