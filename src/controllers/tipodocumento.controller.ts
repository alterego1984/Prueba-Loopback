import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TipoDocumento} from '../models';
import {TipoDocumentoRepository} from '../repositories';

export class TipodocumentoController {
  constructor(
    @repository(TipoDocumentoRepository)
    public tipoDocumentoRepository : TipoDocumentoRepository,
  ) {}

  @post('/tipo-documentos')
  @response(200, {
    description: 'TipoDocumento model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoDocumento)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumento, {
            title: 'NewTipoDocumento',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoDocumento: Omit<TipoDocumento, 'id'>,
  ): Promise<TipoDocumento> {
    return this.tipoDocumentoRepository.create(tipoDocumento);
  }

  @get('/tipo-documentos/count')
  @response(200, {
    description: 'TipoDocumento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoDocumento) where?: Where<TipoDocumento>,
  ): Promise<Count> {
    return this.tipoDocumentoRepository.count(where);
  }

  @get('/tipo-documentos')
  @response(200, {
    description: 'Array of TipoDocumento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoDocumento, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoDocumento) filter?: Filter<TipoDocumento>,
  ): Promise<TipoDocumento[]> {
    return this.tipoDocumentoRepository.find(filter);
  }

  @patch('/tipo-documentos')
  @response(200, {
    description: 'TipoDocumento PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumento, {partial: true}),
        },
      },
    })
    tipoDocumento: TipoDocumento,
    @param.where(TipoDocumento) where?: Where<TipoDocumento>,
  ): Promise<Count> {
    return this.tipoDocumentoRepository.updateAll(tipoDocumento, where);
  }

  @get('/tipo-documentos/{id}')
  @response(200, {
    description: 'TipoDocumento model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoDocumento, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TipoDocumento, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoDocumento>
  ): Promise<TipoDocumento> {
    return this.tipoDocumentoRepository.findById(id, filter);
  }

  @patch('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumento PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumento, {partial: true}),
        },
      },
    })
    tipoDocumento: TipoDocumento,
  ): Promise<void> {
    await this.tipoDocumentoRepository.updateById(id, tipoDocumento);
  }

  @put('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumento PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tipoDocumento: TipoDocumento,
  ): Promise<void> {
    await this.tipoDocumentoRepository.replaceById(id, tipoDocumento);
  }

  @del('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumento DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tipoDocumentoRepository.deleteById(id);
  }
}
