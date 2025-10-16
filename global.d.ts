// CSS dosyaları için modül bildirimi
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare module "@xenova/transformers" {
    /**
     * Dinamik olarak pipeline oluşturur.
     * Kullanımı: const segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4");
     */
    export function pipeline(
      task: string,
      model: string
    ): Promise<(input: unknown, options?: Record<string, unknown>) => Promise<unknown>>;
  
    /**
     * Ortam değişkenleri (örn. env.allowLocalModels = false)
     */
    export const env: { [key: string]: unknown };
  }
  