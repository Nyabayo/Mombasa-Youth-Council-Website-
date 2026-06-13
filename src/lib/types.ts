export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  image?: string
  authorId: string
  authorName: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export interface SessionPayload {
  userId: string
  role: string
  name: string
  email: string
  expiresAt: Date
}

export type PublicUser = Omit<User, 'password'>
