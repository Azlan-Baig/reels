"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  videoUrl: Yup.string().required("Please upload a video"),
  thumbnailUrl: Yup.string().required("Please upload a thumbnail image"),
});

export default function VideoUploadForm() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const handleUploadSuccess = (
    response: IKUploadResponse,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue("videoUrl", response.filePath);
    setFieldValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleSubmit = async (values: VideoFormData, { resetForm }: any) => {
    try {
      await apiClient.createVideo(values);
      showNotification("Video published successfully!", "success");

      // Reset form after successful submission
      resetForm();
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    }
  };

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="form-control">
            <label className="label">Title</label>
            <Field
              type="text"
              name="title"
              className="input input-bordered"
            />
            <ErrorMessage
              name="title"
              component="span"
              className="text-error text-sm mt-1"
            />
          </div>

          <div className="form-control">
            <label className="label">Description</label>
            <Field
              as="textarea"
              name="description"
              className="textarea textarea-bordered h-24"
            />
            <ErrorMessage
              name="description"
              component="span"
              className="text-error text-sm mt-1"
            />
          </div>

          <div className="form-control">
            <label className="label">Upload Video</label>
            <FileUpload
              fileType="video"
              onSuccess={(response) => handleUploadSuccess(response, setFieldValue)}
              onProgress={handleUploadProgress}
            />
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <ErrorMessage
              name="videoUrl"
              component="span"
              className="text-error text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting || !uploadProgress}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing Video...
              </>
            ) : (
              "Publish Video"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}
