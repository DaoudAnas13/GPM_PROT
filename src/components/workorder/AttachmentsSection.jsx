import React from 'react';
import Card from '../ui/Card';
import { Upload, File } from 'lucide-react';

export default function AttachmentsSection() {
  const [files, setFiles] = React.useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBrowse = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Pièces Jointes</h3>
        <span className="text-xs text-gray-400">{files.length} fichier(s)</span>
      </div>

      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <div className="p-3 bg-blue-50 rounded-full mb-3 text-blue-600">
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-gray-900 mb-1">
          Glissez vos fichiers ici ou <span className="text-blue-600 hover:underline">cliquez pour parcourir</span>
        </p>
        <p className="text-xs text-gray-400">PDF, IMAGES, DOCX (Max 10MB)</p>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleBrowse}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
          {files.map((file, idx) => (
             <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
               <div className="flex items-center space-x-3 overflow-hidden">
                 <div className="p-1.5 bg-white rounded shadow-sm">
                   <File className="h-4 w-4 text-gray-500" />
                 </div>
                 <span className="text-sm text-gray-700 truncate">{file.name}</span>
               </div>
               <span className="text-xs text-gray-400 whitespace-nowrap">
                 {(file.size / 1024).toFixed(1)} KB
               </span>
             </div>
          ))}
        </div>
      )}
    </Card>
  );
}

