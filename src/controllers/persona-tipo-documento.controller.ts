import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Persona,
  TipoDocumento,
} from '../models';
import {PersonaRepository} from '../repositories';

export class PersonaTipoDocumentoController {
  constructor(
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository,
  ) { }

  @get('/personas/{id}/tipo-documento', {
    responses: {
      '200': {
        description: 'TipoDocumento belonging to Persona',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoDocumento)},
          },
        },
      },
    },
  })
  async getTipoDocumento(
    @param.path.string('id') id: typeof Persona.prototype.id,
  ): Promise<TipoDocumento> {
    return this.personaRepository.tipoDocumento(id);
  }
}
