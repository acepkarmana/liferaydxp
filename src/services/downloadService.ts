import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { sourceFiles } from './sourceBundle';

/**
 * Downloads the entire Liferay Admin Dashboard project as a ZIP file.
 * Uses JSZip to create the archive in the browser and triggers a download.
 */
export async function downloadProjectSource(): Promise<void> {
  const zip = new JSZip();

  // Add all source files to the ZIP
  for (const file of sourceFiles) {
    zip.file(file.path, file.content);
  }

  // Generate the ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Trigger download
  saveAs(blob, 'liferay-admin-dashboard.zip');
}

/**
 * Downloads a single file by path from the source bundle.
 */
export function downloadSingleFile(filePath: string): void {
  const file = sourceFiles.find(f => f.path === filePath);
  if (!file) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  const fileName = filePath.split('/').pop() || 'file.txt';
  saveAs(blob, fileName);
}

/**
 * Gets a list of all available files in the source bundle.
 */
export function getSourceFileList(): { path: string; size: number }[] {
  return sourceFiles.map(f => ({
    path: f.path,
    size: f.content.length,
  }));
}
