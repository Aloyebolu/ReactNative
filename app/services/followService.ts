import  host  from "@/constants/Env";
import  showAlert  from "@/components/CustomAlert";
export const followUser = async (userId : string, followerId : string) => {
  try {
    const response = await fetch(`http://${host}/api/user/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, followerId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }else{
        showAlert('success', "Followed successfully!");
    }

    return data;
  } catch (error) {
    console.error("Follow error:", error);
    return null;
  }
};
