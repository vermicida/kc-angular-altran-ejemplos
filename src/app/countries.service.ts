import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';

import { environment } from '../environments/environment';

@Injectable()
export class CountriesService {

  constructor(private _httpClient: HttpClient) { }

  searchCountries(text: string): Observable<any> {

    let result: Observable<any>;

    // Comprobamos que la cadena de texto tenga valor.
    if (text) {

      // Construimos un objeto de opciones para personalizar
      // la petición HTTP. Para añadir query parameters utilizamos
      // la propiedad 'params' del objeto de opciones. En este
      // caso, filtramos y ordenamos por 'translations.es'.
      const options = {
        params: new HttpParams()
          .set('translations.es_like', text)
          .set('_sort', 'translations.es')
          .set('_order', 'asc')
      };

      result = this._httpClient.get<any>(`${environment.apiServer}/countries`, options);
    }
    // En caso de que la cadena de texto está vacía.
    else {
      result = Observable.of([]);
    }

    return result;
  }

}
