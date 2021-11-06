import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  TipoDocumento,
  Persona,
} from '../models';
import {TipoDocumentoRepository} from '../repositories';

export class TipoDocumentoPersonaController {
  constructor(
    @repository(TipoDocumentoRepository) protected tipoDocumentoRepository: TipoDocumentoRepository,
  ) { }

  @get('/tipo-documentos/{id}/personas', {
    responses: {
      '200': {
        description: 'Array of TipoDocumento has many Persona',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Persona)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Persona>,
  ): Promise<Persona[]> {
    return this.tipoDocumentoRepository.personas(id).find(filter);
  }

  @post('/tipo-documentos/{id}/personas', {
    responses: {
      '200': {
        description: 'TipoDocumento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Persona)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof TipoDocumento.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {
            title: 'NewPersonaInTipoDocumento',
            exclude: ['id'],
            optional: ['tipoDocumentoId']
          }),
        },
      },
    }) persona: Omit<Persona, 'id'>,
  ): Promise<Persona> {
    return this.tipoDocumentoRepository.personas(id).create(persona);
  }

  @patch('/tipo-documentos/{id}/personas', {
    responses: {
      '200': {
        description: 'TipoDocumento.Persona PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {partial: true}),
        },
      },
    })
    persona: Partial<Persona>,
    @param.query.object('where', getWhereSchemaFor(Persona)) where?: Where<Persona>,
  ): Promise<Count> {
    return this.tipoDocumentoRepository.personas(id).patch(persona, where);
  }

  @del('/tipo-documentos/{id}/personas', {
    responses: {
      '200': {
        description: 'TipoDocumento.Persona DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Persona)) where?: Where<Persona>,
  ): Promise<Count> {
    return this.tipoDocumentoRepository.personas(id).delete(where);
  }
}
