import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg bg-white flex flex-col items-center justify-center p-6 transition-all duration-200 hover:border-yellow-400 ${
          isEditMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {/* --- Image not selected yet --- */}
        {!imageFile && !uploadedImageUrl && (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center text-center"
          >
            <UploadCloudIcon className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-500">Drag & drop or click to upload image</span>
          </Label>
        )}

        {/* --- Loading state --- */}
        {imageLoadingState && (
          <div className="flex flex-col items-center justify-center w-full">
            <Skeleton className="h-40 w-40 rounded-lg mb-2 bg-gray-100" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        )}

        {/* --- Uploaded image preview --- */}
        {!imageLoadingState && uploadedImageUrl && (
          <div className="flex flex-col items-center justify-center">
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="w-40 h-40 object-cover rounded-lg border mb-3 shadow-md"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
