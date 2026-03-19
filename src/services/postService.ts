import api from './api';

export interface PostAuthor {
  id: number;
  full_name: string | null;
  avatar: string | null;
}

export interface PostMedia {
  id: number;
  url: string;
  media_type: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string | null;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  media: PostMedia[];
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  likes_count: number;
  is_liked: boolean;
  replies?: Comment[];
}

export interface PostDetail extends Post {
  comments: Comment[];
}

export interface PostListResponse {
  items: Post[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface PostCreate {
  title?: string;
  content: string;
}

export interface CommentCreate {
  content: string;
  parent_id?: number;
}

class PostService {
  async getPosts(page = 1, per_page = 20, author_id?: number): Promise<PostListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });
    if (author_id) {
      params.append('author_id', author_id.toString());
    }
    const response = await api.get(`/posts/?${params.toString()}`);
    return response.data;
  }

  async getPost(postId: number): Promise<PostDetail> {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  }

  async createPost(post: PostCreate): Promise<Post> {
    const response = await api.post('/posts/', post);
    return response.data;
  }

  async updatePost(postId: number, post: Partial<PostCreate>): Promise<Post> {
    const response = await api.put(`/posts/${postId}`, post);
    return response.data;
  }

  async deletePost(postId: number): Promise<void> {
    await api.delete(`/posts/${postId}`);
  }

  async likePost(postId: number): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  }

  async unlikePost(postId: number): Promise<void> {
    await api.delete(`/posts/${postId}/like`);
  }

  async uploadMedia(postId: number, file: File): Promise<PostMedia> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/posts/${postId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async createComment(postId: number, comment: CommentCreate): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, comment);
    return response.data;
  }

  async updateComment(commentId: number, content: string): Promise<Comment> {
    const response = await api.put(`/posts/comments/${commentId}`, { content });
    return response.data;
  }

  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/posts/comments/${commentId}`);
  }

  async likeComment(commentId: number): Promise<void> {
    await api.post(`/posts/comments/${commentId}/like`);
  }

  async unlikeComment(commentId: number): Promise<void> {
    await api.delete(`/posts/comments/${commentId}/like`);
  }
}

export default new PostService();
