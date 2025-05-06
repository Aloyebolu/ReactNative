// You can replace this with a global env variable too

import host from "@/constants/Env";

interface GetUserImageUrlParams {
  userId: string;
}

export const getUserImageUrl = (userId: GetUserImageUrlParams['userId']): string => {
  const BASE_URL = `http://${host}`; 
  return `${BASE_URL}/api/image/${userId}`;
};
