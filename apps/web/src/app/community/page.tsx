"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface PostItem {
  id: string;
  title: string;
  body: string;
  category: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "General",
  FOR_SALE: "For Sale",
  TIPS: "Tips & Tricks",
  COLLABORATION: "Collaboration",
  RECOMMENDATION: "Recommendations",
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadPosts();
  }, [category]);

  async function loadPosts() {
    try {
      const params = category ? `?category=${category}` : "";
      const res = await api.get<{ data: { items: PostItem[] } }>(`/posts${params}`);
      setPosts(res.data.items);
    } catch {
      // Handle error
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="mt-2 text-gray-600">
            Connect with providers and clients. Share tips, sell gear, find collaborators.
          </p>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Button variant={!category ? "primary" : "outline"} size="sm" onClick={() => setCategory("")}>
              All
            </Button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Button
                key={key}
                variant={category === key ? "primary" : "outline"}
                size="sm"
                onClick={() => setCategory(key)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {posts.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No posts yet. Be the first!</p>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-brand-600">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      <h3 className="mt-1 font-semibold text-gray-900">{post.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-3">{post.body}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {post.author.firstName} {post.author.lastName}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.commentsCount} comments</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
