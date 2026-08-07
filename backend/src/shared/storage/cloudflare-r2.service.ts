/**
 * Cloudflare R2 - reservado para fotos de progresso do usuário em fases futuras.
 * Requer R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY e R2_BUCKET_NAME.
 */
export class CloudflareR2Service {
  private accountId = process.env.R2_ACCOUNT_ID
  private accessKeyId = process.env.R2_ACCESS_KEY_ID
  private secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  private bucket = process.env.R2_BUCKET_NAME

  async upload(objectKey: string, data: Buffer, contentType: string): Promise<string> {
    if (!this.accountId || !this.accessKeyId || !this.secretAccessKey || !this.bucket) {
      throw new Error('Configuração do R2 incompleta (R2_* não configurado)')
    }
    void objectKey
    void data
    void contentType
    // TODO fase futura: implementar upload com AWS SDK/S3 (R2 é S3-compatível)
    return `https://${this.bucket}.r2.cloudflarestorage.com/${objectKey}`
  }
}

export const cloudflareR2 = new CloudflareR2Service()