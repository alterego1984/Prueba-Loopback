import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Vehiculo,
  Persona,
} from '../models';
import {VehiculoRepository} from '../repositories';

export class VehiculoPersonaController {
  constructor(
    @repository(VehiculoRepository)
    public vehiculoRepository: VehiculoRepository,
  ) { }

  @get('/vehiculos/{id}/persona', {
    responses: {
      '200': {
        description: 'Persona belonging to Vehiculo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Persona)},
          },
        },
      },
    },
  })
  async getPersona(
    @param.path.string('id') id: typeof Vehiculo.prototype.id,
  ): Promise<Persona> {
    return this.vehiculoRepository.persona(id);
  }
}
