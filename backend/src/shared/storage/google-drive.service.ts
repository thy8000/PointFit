/**
 * Google Drive service - reservado para armazenamento de vídeos em fases futuras.
 * Requer GOOGLE_DRIVE_API_KEY configurado.
 */
export class GoogleDriveService {
  private apiKey = process.env.GOOGLE_DRIVE_API_KEY

  async uploadVideo(_file: { buffer: Buffer; filename: string }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_DRIVE_API_KEY não configurado')
    }
    // TODO(fase futura): implementar upload de vídeos para o Google Drive
    throw new Error('Google Drive upload ainda não implementado')
  }
}

export const googleDrive = new GoogleDriveService()