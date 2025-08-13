import {
  CommentObject,
  DeckPost,
  SubmitComment,
} from "../../model/deckpost.model";
import { getApiBaseUrl } from "../../utils/apiBase";
import apiClient from "../../utils/apiClient";

interface CommentResponse {
  message: string;
  commentObject: CommentObject;
}

/**
 * This function returns the user posts with parameters to limit and paginate
 * @param page
 * @param limit
 * @returns
 */
export async function fetchUserPost(page: number, limit: number) {
  const res = await fetch(
    `${getApiBaseUrl()}/userpost?page=${page}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch userpost`);
  }
  const rawData = await res.json();
  return rawData;
}

/**
 * This function returns the user posts with parameters to limit and paginate
 * @param page
 * @param limit
 * @returns
 */
export async function fetchUserPostByType(
  tcg: string,
  page: number,
  limit: number
) {
  const res = await fetch(
    `${getApiBaseUrl()}/userpost/type/${tcg}?page=${page}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch userpost`);
  }
  const rawData = await res.json();
  return rawData;
}

/**
 * This function is to return a user's own posting with param for pagination and limit
 * @param page
 * @param limit
 * @returns
 */
export async function fetchUserPostByListing(page: number, limit: number) {
  const urlPath = `${getApiBaseUrl()}/userpost/listuserpostings?page=${page}&limit=${limit}`;
  const response = await apiClient.get<DeckPost[]>(urlPath);
  return response.data;
}

/**
 * Ths function is used to create a user post
 * @param post 
 * @returns 
 */
export async function userMakePost(post: DeckPost) {
  const response = await apiClient.post(`/userpost/post`, post);
  return {
    message: response.data.message,
  };
}

/**
 * This function is used to delete post by postId
 * @param postId 
 * @returns 
 */
export async function userDeletePost(postId: string) {
  const response = await apiClient.delete(`/userpost/delete/${postId}`);
  return {
    message: response.data.message,
  };
}

/**
 * This function allows user to comment on a post
 * @param payload 
 * @returns 
 */
export async function userCommentPost(payload: SubmitComment) {
  const response = await apiClient.post<CommentResponse>(
    `/userpost/comment`,
    payload
  );
  return response.data.commentObject;
}

export async function userDeleteComment(postId: string, commentId: string) {
  const response = await apiClient.delete(
    `/userpost/comment/${postId}/delete/${commentId}`
  );
  return {
    commentId: response.data.comment,
    message: response.data.message,
  };
}

export async function userLikePost(postId: string, posterId: string) {
  try {
    const response = await apiClient.post(
      `/userpost/like/${postId}/postedby/${posterId}`
    );
    return {
      message: response.data?.message || 'Liked successfully', // Optional message
      success: response.status >= 200 && response.status < 300 // Status-based success
    };
  } catch (error:any) {
    return {
      message: error.response?.data?.message || 'Failed to like post',
      success: false
    };
  }
}

export async function userUnlikePost(postId: string) {
  try {
    const response = await apiClient.delete(
      `/userpost/unlike/${postId}`
    );
    return {
      message: response.data?.message || 'Unliked successfully',
      success: response.status >= 200 && response.status < 300
    };
  } catch (error:any) {
    return {
      message: error.response?.data?.message || 'Failed to unlike post',
      success: false
    };
  }
}
