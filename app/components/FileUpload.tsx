"use client";
import React, {  useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import  { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res:IKUploadResponse) => void
    onProgress? : (progress : number) => void
    fileType? : 'image' | 'video'
}

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = 'image'
} : FileUploadProps) {
 
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const handleError = (err : {message:string}) => {
    setError(err.message);
    setUploading(false);
  };
  
  const handleSuccess = (response : IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };
  
  const handleProgress = (evt:ProgressEvent) => {
  if(onProgress && evt.lengthComputable){
    const percentComplete = (evt.loaded / evt.total) * 100;
    onProgress(Math.round(percentComplete));
  };
  
  const handleUpload = () => {
    setUploading(true);
    setError(null);  };

  const validateFile = (file : File) => {
    if(fileType === 'video' && file.type !== 'video/') {
      setError("Please upload a video file");
      return false;
    }
    if(file.size > 100 * 1024 * 1024) {
      setError("Please upload a file less than 100MB");
      return false;
    }
   else {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return false;
    }
    return false;
   }

  }
  return (
    <div className="App">
      <h1>ImageKit Next.js quick start</h1>

        <p>Upload an image with advanced options</p>
        <IKUpload
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={handleError}
          accept={fileType === 'image' ? "image/*" : "video/*"}
          onSuccess={handleSuccess}
          className="file-input file-input-bordered w-full"
          onUploadProgress={handleProgress}
          onUploadStart={handleUpload}
          folder={fileType === 'image' ? "/images" : "/videos"}
        />
        {
          uploading && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="animate-spin w-4 h-4"/>
              <span>Upload....</span>
            </div>
          )
        }
        {
          error && (
            <div className="text-error text-sm ">
              <span>{error}</span>
            </div>
          )
        }
    </div>
  );
}
}