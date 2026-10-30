import { useState } from 'react';
import { SourceFile, sourceFiles } from '../services/sourceBundle';
import { downloadProjectSource } from '../services/downloadService';
import { FileCode, Folder, Copy, Download, Eye, ChevronRight, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SourceCode() {
  const [selectedFile, setSelectedFile] = useState<SourceFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/pages', 'src/components', 'src/services', 'src/types', 'src/data']));
  const [downloading, setDownloading] = useState(false);

  // Build file tree
  const fileTree = buildFileTree(sourceFiles);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCopyFile = (file: SourceFile) => {
    navigator.clipboard.writeText(file.content);
    toast.success(`Copied ${file.path} to clipboard`);
  };

  const handleDownloadFile = (file: SourceFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${file.path}`);
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      await downloadProjectSource();
      toast.success('All source files downloaded as ZIP!');
    } catch (error) {
      toast.error('Download failed');
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Source Code</h1>
          <p className="text-sm text-gray-500 mt-1">Browse, view, copy, and download all generated source files</p>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg"
        >
          <Download size={18} />
          {downloading ? 'Preparing ZIP...' : 'Download All as ZIP'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{sourceFiles.length}</p>
          <p className="text-sm text-gray-500">Total Files</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">
            {(sourceFiles.reduce((acc, f) => acc + f.content.length, 0) / 1024).toFixed(1)} KB
          </p>
          <p className="text-sm text-gray-500">Total Size</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-600">TypeScript</p>
          <p className="text-sm text-gray-500">Primary Language</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Tree */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">File Explorer</h3>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {renderFileTree(fileTree, '', expandedFolders, toggleFolder, setSelectedFile, selectedFile)}
          </div>
        </div>

        {/* File Viewer */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selectedFile ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{selectedFile.path}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyFile(selectedFile)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                  <button
                    onClick={() => handleDownloadFile(selectedFile)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap break-words">
                  {selectedFile.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
              <Eye size={48} className="mb-4" />
              <p className="text-sm">Select a file to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface FileTreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileTreeNode[];
  file?: SourceFile;
}

function buildFileTree(files: SourceFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join('/');

      let node = current.find(n => n.name === part);
      if (!node) {
        node = {
          name: part,
          path,
          isFolder: !isLast,
          children: !isLast ? [] : undefined,
          file: isLast ? file : undefined,
        };
        current.push(node);
      }

      if (!isLast && node.children) {
        current = node.children;
      }
    });
  });

  return root;
}

function renderFileTree(
  nodes: FileTreeNode[],
  indent: string,
  expandedFolders: Set<string>,
  toggleFolder: (path: string) => void,
  setSelectedFile: (file: SourceFile | null) => void,
  selectedFile: SourceFile | null
): React.ReactNode {
  return nodes.map(node => {
    if (node.isFolder) {
      const isExpanded = expandedFolders.has(node.path);
      return (
        <div key={node.path}>
          <button
            onClick={() => toggleFolder(node.path)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            style={{ paddingLeft: `${indent.length * 12 + 8}px` }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={14} className="text-blue-500" />
            <span className="font-medium">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div>{renderFileTree(node.children, indent + '  ', expandedFolders, toggleFolder, setSelectedFile, selectedFile)}</div>
          )}
        </div>
      );
    } else {
      const isSelected = selectedFile?.path === node.path;
      return (
        <button
          key={node.path}
          onClick={() => node.file && setSelectedFile(node.file)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${indent.length * 12 + 28}px` }}
        >
          <FileCode size={14} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
          <span className="truncate">{node.name}</span>
        </button>
      );
    }
  });
}
