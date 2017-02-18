import {Response} from "@angular/http";
/**
 * Created by eze on 29/01/17.
 */
export class ParsearError {

  public parsear(error: Response){
    const body = error.json();
    const err = body.error || JSON.stringify(body);
    let mensajeError = JSON.parse(err);
    return mensajeError.mensaje;
  }


}
