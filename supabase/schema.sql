-- ============================================================
-- MYC Portal — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL,
  image       TEXT,
  author_id   TEXT NOT NULL,
  author_name TEXT NOT NULL,
  published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (custom auth — NOT Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id          TEXT PRIMARY KEY,
  post_id     TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id   TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS posts_slug_idx       ON public.posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx  ON public.posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);

-- Disable RLS (all writes go through the server — enable RLS later for production)
ALTER TABLE public.posts    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
