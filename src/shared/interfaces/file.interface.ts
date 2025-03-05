export interface FileUploadProgressInterface {
  id: string;
  // progress: string,
  completed: boolean;
  percentage: number;
}

export interface VideoThumbNailInterface {
  videoURLs: string[];
  thumbNailURLs: string[];
}
