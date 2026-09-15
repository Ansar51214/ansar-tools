declare module 'piexifjs' {
  export interface ExifRecord {
    [key: string]: unknown;
  }

  export interface Piexif {
    ImageIFD: Record<string, number>;
    ExifIFD: Record<string, number>;
    GPSIFD: Record<string, number>;
    InteropIFD: Record<string, number>;
    dump: (exifObj: ExifRecord) => string;
    insert: (exifBytes: string, dataUrl: string) => string;
    load: (dataUrl: string) => ExifRecord;
    remove: (dataUrl: string) => string;
  }

  const piexif: Piexif;
  export default piexif;
}
