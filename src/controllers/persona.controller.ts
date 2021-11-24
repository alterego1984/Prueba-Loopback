import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Keys} from '../config/keys';
import {Credenciales, Persona} from '../models';
import {PersonaRepository} from '../repositories';
import {AutenticacionService} from '../services';
const fetch = require("node-fetch");

export class PersonaController {
  constructor(
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }

  @post("/autenticarPersona", {
    responses: {
      "200": {
        description: "Autenticación de usuarios"
      }
    }
  })
  async autenticarPersona(
    @requestBody() credenciales: Credenciales
  ) {
    let persona = await this.servicioAutenticacion.IdentificarPersona(credenciales.usuario, credenciales.contrasena);
    if (persona) {
      let token = this.servicioAutenticacion.GenerarJWT(persona);
      return {
        datos: {
          nombre: persona.nombres + " " + persona.apellidos,
          correo: persona.correo,
          id: persona.id,
          rol: "Cliente"
        },
        tk: token
      }

    } else {
      throw new HttpErrors[401]("Los datos ingresados no son válidos");
    }
  }

  @authenticate("cliente")
  @post('/personas')
  @response(200, {
    description: 'Persona model instance',
    content: {'application/json': {schema: getModelSchemaRef(Persona)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {
            title: 'NewPersona',
            exclude: ['id'],
          }),
        },
      },
    })
    persona: Omit<Persona, 'id'>,
  ): Promise<Persona> {
    //creamos una contraseña aleatoria
    let password = this.servicioAutenticacion.GenerarPassword();
    //ciframos la contraseña
    let passwordCifrado = this.servicioAutenticacion.CifrarPassword(password);
    persona.password = passwordCifrado;
    let person = await this.personaRepository.create(persona);
    //envio de notificación al correo
    let correo = persona.correo;
    let asunto = `Bienvenido(a) ${persona.nombres}`;
    let mensaje = `<p>Hola ${persona.nombres} ${persona.apellidos}, te damos la bienvenida a la plataforma <strong>Sobre Ruedas</strong>. Debes usar los siguientes datos para ingresar</p>
                  <p>Usuario: ${persona.correo}</p>
                  <p>Contraseña: ${password}</p>`;

    // fetch("http://127.0.0.1:5000/email?email="+correo+"&subject="+asunto+"&message="+mensaje)
    //   .then((data: any) => {
    //     console.log(data);
    //   });
    fetch(`${Keys.urlSrvNotificacion}/email?email=${correo}&subject=${asunto}&message=${mensaje}`)
      .then((data: any) => {
        console.log(data);
      });

    return person;
  }

  @get('/personas/count')
  @response(200, {
    description: 'Persona model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Persona) where?: Where<Persona>,
  ): Promise<Count> {
    return this.personaRepository.count(where);
  }

  @get('/personas')
  @response(200, {
    description: 'Array of Persona model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Persona, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Persona) filter?: Filter<Persona>,
  ): Promise<Persona[]> {
    return this.personaRepository.find(filter);
  }

  @patch('/personas')
  @response(200, {
    description: 'Persona PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {partial: true}),
        },
      },
    })
    persona: Persona,
    @param.where(Persona) where?: Where<Persona>,
  ): Promise<Count> {
    return this.personaRepository.updateAll(persona, where);
  }

  @get('/personas/{id}')
  @response(200, {
    description: 'Persona model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Persona, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Persona, {exclude: 'where'}) filter?: FilterExcludingWhere<Persona>
  ): Promise<Persona> {
    return this.personaRepository.findById(id, filter);
  }

  @patch('/personas/{id}')
  @response(204, {
    description: 'Persona PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {partial: true}),
        },
      },
    })
    persona: Persona,
  ): Promise<void> {
    await this.personaRepository.updateById(id, persona);
  }

  @put('/personas/{id}')
  @response(204, {
    description: 'Persona PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() persona: Persona,
  ): Promise<void> {
    await this.personaRepository.replaceById(id, persona);
  }

  @del('/personas/{id}')
  @response(204, {
    description: 'Persona DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.personaRepository.deleteById(id);
  }
}
