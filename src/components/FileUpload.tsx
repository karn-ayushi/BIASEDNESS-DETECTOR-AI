import React, { useRef } from 'react';
import { Upload, FileType, CheckCircle2, AlertCircle } from 'lucide-react';
import { Candidate, Gender, Region, AgeGroup, Education } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: Candidate[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsedData: Candidate[] = rows.slice(1).map((row, index) => {
        const values = row.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });

        return {
          id: `upload-${index}`,
          name: obj.name || 'Anonymous',
          gender: (obj.gender as Gender) || 'Other',
          region: (obj.region || obj['region/state'] || 'Urban') as Region,
          ageGroup: (obj.agegroup || obj['age group'] || '26-40') as AgeGroup,
          education: (obj.education || obj['education level'] || 'UG') as Education,
          skills: parseInt(obj.skills) || 0,
          experience: parseInt(obj.experience) || 0,
        };
      });

      onDataLoaded(parsedData);
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="border-2 border-dashed border-white/10 rounded-xl p-8 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group text-center"
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".csv" 
        className="hidden" 
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-white/90">Upload Custom Dataset</p>
          <p className="text-xs text-white/40 mt-1">Accepts .CSV (Name, Gender, Region, Age, Education, Skills, Exp)</p>
        </div>
      </div>
    </div>
  );
};
