import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Keys} from '../config/keys';
import {Persona} from '../models';
import {PersonaRepository} from '../repositories';
const generador = require("password-generator");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRepositorio: PersonaRepository
  ) { }

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

  IdentificarPersona(usuario: string, clave: string) {
    try {
      let persona = this.personaRepositorio.findOne({where: {correo: usuario, password: clave}});
      if (persona) {
        return persona;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  GenerarJWT(persona: Persona) {
    let token = jwt.sign({
      data: {
        id: persona.id,
        correo: persona.correo,
        nombre: persona.nombres + " " + persona.apellidos
      }
    }, Keys.claveJWT
    );
    return token;
  }

  ValidarJWT(token: string) {
    try {
      let datos = jwt.verify(token, Keys.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
}
