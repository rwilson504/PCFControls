import { httpClient } from './HttpClient';
import { IAnnotation, IAnnotationsResponse, FileUploadOptions } from '../types';
import * as Constants from "../utils/constants";

export class AnnotationService {
  /**
   * Loads annotations for an entity
   */
  async loadAnnotations(entityTypeName: string, entityId: string): Promise<IAnnotation[]> {
    const fetchXmlQuery = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
      <entity name="annotation">
        <attribute name="filename" />
        <attribute name="annotationid" />  
        <attribute name="createdon"/>
        <attribute name="objectid" />
        <attribute name="objecttypecode" />
        <filter type="and">
          <condition attribute="filename" operator="ends-with" value="${Constants.AZURE_FILE_EXTENSION}" />
        </filter>
        <link-entity name="${entityTypeName}" from="${entityTypeName}id" to="objectid" link-type="inner" alias="ad">
          <filter type="and">
            <condition attribute="${entityTypeName}id" operator="eq" value="${entityId}"/>
          </filter>
        </link-entity>
      </entity>
    </fetch>`;

    const xmlCompact = fetchXmlQuery
      .replace(/(\r\n|\n|\r)/g, '')   // remove line breaks
      .replace(/>\s+</g, '><')        // collapse spaces between tags
      .trim();
    const params = new URLSearchParams({ fetchXml: xmlCompact });
    const url = `/_api/annotations?${params.toString()}`;
    const response = await httpClient.get<IAnnotationsResponse>(url);
    return response.value || [];
  }

  /**
   * Initializes the upload and returns the annotation ID
   */
  async initializeUpload(entityName: string, entityId: string, file: File, abortSignal?: AbortSignal): Promise<string> {
    const initUrl = `/_api/file/InitializeUpload/${entityName}(${entityId})/blob`;

    if (abortSignal?.aborted) {
      throw new Error('Upload aborted');
    }

    const initResponse = await httpClient.post<string>(
      initUrl,
      file.size === 0 ? {} : undefined, // Only send empty object for empty files
      {
        headers: {
          'x-ms-file-name': encodeURIComponent(file.name),
          'x-ms-file-size': file.size.toString(),
          'Content-Type': 'application/octet-stream'
        },
        signal: abortSignal
      }
    );

    return initResponse || ''; // Ensure annotationId is set
  }

  /**
   * Uploads file chunks
   */
  async uploadFileChunks(annotationId: string, file: File, options?: FileUploadOptions): Promise<void> {
    const { onProgress, abortSignal } = options || {};

    const chunkSize = this.determineChunkSize(file.size);
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let blockIndex = 0; blockIndex < totalChunks; blockIndex++) {
      if (abortSignal?.aborted) {
        throw new Error('Upload aborted');
      }

      const offset = blockIndex * chunkSize;
      const end = Math.min(offset + chunkSize, file.size);
      const chunk = file.slice(offset, end);
      const chunkData = await this.readFileChunk(chunk);

      try {
        await httpClient.put(
          `/_api/file/UploadBlock/blob?offset=${offset}&fileSize=${file.size}&chunkSize=${chunkSize}&token=${annotationId}`,
          chunkData,
          {
            headers: {
              'x-ms-file-name': encodeURIComponent(file.name),
              'Content-Type': 'application/octet-stream'
            },
            onUploadProgress: (progressEvent) => {
              if (onProgress && progressEvent.total) {
                const chunkProgress = progressEvent.loaded / progressEvent.total;
                const overallProgress = ((blockIndex + chunkProgress) / totalChunks) * 100;
                onProgress(Math.min(99, overallProgress));
              }
            },
            signal: abortSignal
          }
        );

        // Update progress after each successful chunk
        if (onProgress) {
          const progress = Math.min(99, ((blockIndex + 1) / totalChunks) * 100);
          onProgress(progress);
        }
      } catch (error) {
        if (abortSignal?.aborted) {
          throw new Error('Upload aborted');
        }
        throw error;
      }
    }

    // Upload complete
    if (onProgress) {
      onProgress(100);
    }
  }

  /**
   * Deletes an annotation
   */
  async deleteAnnotation(annotationId: string): Promise<void> {
    const url = `/_api/file/delete/annotation(${annotationId})/blob/$value`;
    await httpClient.delete(url);
  }

  /**
   * Gets the download URL for an annotation
   */
  getDownloadUrl(annotationId: string): string {
    return `/_api/file/download/annotation(${annotationId})/blob/$value`;
  }

  /**
   * Reads a file chunk as ArrayBuffer
   */
  private readFileChunk(chunk: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsArrayBuffer(chunk);
    });
  }

  /**
   * Determines optimal chunk size based on file size
   */
  private determineChunkSize(fileSize: number): number {
    if (fileSize > 100 * 1024 * 1024) {
      return 50 * 1024 * 1024; // 50MB for files > 100MB
    } else if (fileSize > 10 * 1024 * 1024) {
      return 10 * 1024 * 1024; // 10MB for files > 10MB
    } else {
      return 4 * 1024 * 1024; // 4MB for smaller files
    }
  }
}

// Export a singleton instance
export const annotationService = new AnnotationService();
