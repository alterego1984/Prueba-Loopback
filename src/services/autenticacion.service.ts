import { /* inject, */ BindingScope, injectable} from '@loopback/core';
const generador = require("password-generator");
const crypto = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  GenerarPassword() {
    let password = generador(6, false);
    return password;
  }

  CifrarPassword(password: string) {
    let passwordCifrado = crypto.MD5(password).toString();
    return passwordCifrado;
  }
}
