export interface UploadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    key: string;
    url: string;
    bucket: string;
  };
}

export interface UploadResult {
  success: boolean;
  data?: {
    urls: { original: string };
    keys: { original: string };
  };
  error?: string;
}
