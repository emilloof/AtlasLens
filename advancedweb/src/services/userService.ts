import { apiRequest, ApiResponse } from "./api-clients";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface Album {
  album_id: string;
  city_name: string;
  latitude: number;
  longitude: number;
  users: string[];
  images: string[];
}

export const userService = {
  getUserProfile: (userId: string): Promise<ApiResponse<UserProfile>> => apiRequest<UserProfile>(`user/${userId}`),

  // updateUserProfile: (userId: string, profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> =>
  //   apiRequest<UserProfile>(`user/${userId}`, {
  //     method: "PUT",
  //     body: profileData,
  //   }),
  getUserAlbum: (): Promise<ApiResponse<Album>> => apiRequest<Album>(`album`),

  addUserToAlbum: (user_id: string, album_id: string): Promise<ApiResponse<Album>> =>
    apiRequest<Album>(`add_user_to_album`, {
      method: "POST",
      body: {
        user_id,
        album_id,
      },
    }),
  browUser: (): Promise<ApiResponse<Album>> => apiRequest<Album>(`brow_user`),
  makeAlbum: (
    album_id: string,
    city_name: string,
    latitude: number,
    longitude: number,
    users: string[],
    images: string[]
  ): Promise<ApiResponse<Album>> =>
    apiRequest<Album>(`make_album`, {
      method: "POST",
      body: {
        album_id,
        city_name,
        latitude,
        longitude,
        users,
        images,
      },
    }),

  deleteUserAccount: (userId: string): Promise<ApiResponse<void>> =>
    apiRequest<void>(`user/${userId}`, {
      method: "DELETE",
    }),
  getMyMap: (): Promise<ApiResponse<Album[]>> => apiRequest<Album[]>(`mymap`),
};
