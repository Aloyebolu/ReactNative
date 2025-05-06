import host from "@/constants/Env";
import axios from "axios";

export const uploadImage = async (imageData: {
  uri: string;
  fileName?: string;
  type?: string;
}) => {
  const uploadUrl = `http://${host}/api/image`; // Ensure 'host' doesn't include 'http://' already

  try {
    const formData = new FormData();

    formData.append("image", {
      uri: imageData.uri,
      name: imageData.fileName || "photo.jpg",
      type: imageData.type || "image/jpeg",
    } as any);

    const userId = { user_id: 1000129039 }; // 🧠 match the server-side expected structure
    formData.append("json", JSON.stringify(userId));

    try {
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return 'success'
      } catch (err) {
        console.error(err);
      }

  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};
