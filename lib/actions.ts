// lib/actions.ts
"use server"; // Dòng này cực kỳ quan trọng, nó báo cho Next.js đây là code Server

import { getAllPosts } from "@/lib/posts";

export async function fetchAllPostsAction() {
  return await getAllPosts();
}