import { Metadata } from '../../model/metadata'
import { MetadataRepository } from '../../repositories/metadata'
import { Services } from '../../services'

export class MemMetadataRepository implements MetadataRepository {
  constructor(private config: Services['config']) {}

  async fetchMetadata() {
    return new Metadata({
      version: this.config.version
    })
  }
}