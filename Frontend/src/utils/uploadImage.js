import axiosInstance from "./axiosInstance";

/**
 * Uploads an image file to the server
 * @param {File} imageFile - The image file to upload
 * @param {Object} [options] - Optional configuration
 * @param {Function} [options.onUploadProgress] - Progress callback function
 * @param {number} [options.maxFileSize=5] - Max file size in MB
 * @param {string[]} [options.allowedTypes=['image/jpeg', 'image/png', 'image/gif']] - Allowed MIME types
 * @returns {Promise<Object>} - Response data from server
 * @throws {Error} - Custom error messages for different failure cases
 */
const uploadImage = async (imageFile, options = {}) => {
  const {
    onUploadProgress,
    maxFileSize = 5, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  } = options;

  // Validate file exists
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  // Validate file type
  if (!allowedTypes.includes(imageFile.type)) {
    throw new Error(
      `Unsupported file type. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  // Validate file size (in MB)
  const fileSizeMB = imageFile.size / (1024 * 1024);
  if (fileSizeMB > maxFileSize) {
    throw new Error(`File size exceeds ${maxFileSize}MB limit`);
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  // Add any additional metadata if needed
  formData.append("uploadedAt", new Date().toISOString());

  try {
    const response = await axiosInstance.post("/image-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
      maxContentLength: maxFileSize * 1024 * 1024, // Set max upload size
      timeout: 30000, // 30 seconds timeout
    });

    // Validate response structure
    if (!response.data || !response.data.url) {
      throw new Error("Invalid server response format");
    }

    return response.data;
  } catch (error) {
    console.error("Image upload error:", error);

    // Enhanced error handling
    let errorMessage = "Image upload failed";

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      // No response received
      errorMessage = "No response from server. Please check your connection.";
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. Please try again.";
    }

    throw new Error(errorMessage);
  }
};

export default uploadImage;
