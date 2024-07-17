import axios from "axios";

export const uploadMultiImages = async (selectedImages, fileRoute = "/") => {
  const accessToken = localStorage.getItem("accessToken");

  const formData = new FormData();
  selectedImages.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("fileRoute", fileRoute);

  const options = {
    method: "POST",
    url: "/api/upload-images",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.post("/api/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data.images);
    return response.data.images;
  } catch (error) {
    console.error("Error uploading images:", error);
    return [];
  }
};
