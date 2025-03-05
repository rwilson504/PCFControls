export interface IAnnotation {
  annotationid: string;
  filename: string;
  createdon: string;
  filesize?: number; // NEW property in bytes (optional)
  display?: boolean; // NEW property to control visibility (optional)
  objectid?: string;
  objecttypecode?: string;
}

export interface IAnnotationsResponse {
  value: IAnnotation[];
}

export interface FileUploadOptions {
  onProgress?: (percent: number) => void;
  abortSignal?: AbortSignal;
}