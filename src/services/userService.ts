import { apiRequest, ApiResponse } from "./api-clients";

export interface UserProfile {
  user: {
    user_id: string;
    user_name: string;
    email: string;
  };
}
interface Image {
  image_id: string;
  url: string;
  album: Album;
  album_id: string;
  created_at: string;
  comments: Comment[];
  filter?: string;
  likes: Like[];
  is_deleted: boolean;
  user_id: string;
}

export interface Like {
  user: UserProfileWhole;
  user_id: string;
  image: Image;
  image_id: string;
  created_at: string;
}
export interface UserProfileWhole {
  user: {
    user_id: string;
    email: string;
    password: string;
    username: string;
    profile_image: string;
    albums: Album[] | undefined;
    likes: Like[] | undefined;
    comments: Comment[] | undefined;
    notifications: Notification[] | undefined;
    images: Image[] | undefined;
  };
}

export interface Notification {
  notification_id: string;
  user: UserProfileWhole | undefined;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  image_id: string;
  comment_id: string;
}
export interface Album {
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
  getMyProfile: (): Promise<ApiResponse<UserProfileWhole>> => apiRequest<UserProfileWhole>(`me`),
  getUserAlbum: (): Promise<ApiResponse<Album>> => apiRequest<Album>(`album`),

  addUserToAlbum: (user_id: string, album_id: string): Promise<ApiResponse<Album>> =>
    apiRequest<Album>(`add_user_to_album`, {
      method: "POST",
      body: {
        user_id,
        album_id,
      },
    }),
  postProfileImage: (formData: object): Promise<ApiResponse<UserProfileWhole>> =>
    apiRequest<UserProfileWhole>(`add_user_profile_image`, {
      method: "POST",
      body: formData,
    }),
  browseUser: (): Promise<ApiResponse<Album>> => apiRequest<Album>(`browse_user`),
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

  likePhoto: (image_id: string, writer_id: string | undefined): Promise<ApiResponse<Image>> =>
    apiRequest<Image>(`like_photo`, {
      method: "POST",
      body: {
        writer_id,
        image_id,
      },
    }),
  updateImageFilter: (image_id: string, filter: string) =>
    apiRequest<Image>(`image/${image_id}/filter`, {
      method: "PATCH",
      body: {
        filter,
      },
    }),
  // getDeletedImage: (album_id: string) => apiRequest<>(`get_deleted_images?albumId=${album_id}`, {}),
};
