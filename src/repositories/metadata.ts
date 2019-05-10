import { Metadata } from '../model/metadata'

export interface MetadataRepository {
  fetchMetadata(): Promise<Metadata>
}
