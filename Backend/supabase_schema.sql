-- Run this once in the Supabase SQL editor to set up the required schema.

-- Enable pgvector extension
create extension if not exists vector;

-- Settings table: key-value store for frontend preferences
create table if not exists settings (
  key   text primary key,
  value text not null
);

-- Documents table: stores text chunks + embeddings for RAG
create table if not exists documents (
  id        bigint generated always as identity primary key,
  content   text not null,
  embedding vector(1536)
);

-- Index for fast approximate nearest-neighbor search
create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- RPC function used by search_documents() in db/supabase.py
create or replace function match_documents(
  query_embedding vector(1536),
  match_count     int default 5
)
returns table (content text, similarity float)
language plpgsql
as $$
begin
  return query
  select d.content,
         1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;
