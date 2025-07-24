import { apiRequest, ApiResponse } from "./api-clients";

interface UserProfile {
  user: {
    user_id: string;
    user_name: string;
    email: string;
  };
}

interface Album {
  album_id: string;
  city_name: string;
  latitude: number;
  longitude: number;
  users: string[];
  images: string[];
}

interface Comment {
  comment_id: string;
  content: string;
  writer_id: string;
  created_at: string;
  image_id: string;
  parent_id?: string;
  replies?: Comment[];
}

export const userService = {
  getUserProfile: (userId: string): Promise<ApiResponse<UserProfile>> => apiRequest<UserProfile>(`user/${userId}`),
  getMyProfile: (): Promise<ApiResponse<UserProfile>> => apiRequest<UserProfile>(`me`),
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

  addComment: (
    writer_id: string,
    content: string,
    image_id: string,
    parent_id?: string
  ): Promise<ApiResponse<Comment>> =>
    apiRequest<Comment>(`add_comment`, {
      method: "POST",
      body: {
        writer_id,
        content,
        image_id,
        parent_id: parent_id ? parent_id : null,
      },
    }),
  getComments: (image_id: string): Promise<ApiResponse<Comment[]>> => apiRequest<Comment[]>(`get_comments${image_id}`),

  deleteComment: (comment_id: string): Promise<ApiResponse<void>> =>
    apiRequest<void>(`delete_comment/${comment_id}`, {
      method: "DELETE",
    }),
};
