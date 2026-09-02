"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfileById } from "@/lib/data-client";
import { NewConversationComposer } from "@/components/messages/new-conversation-composer";
import { useAuth } from "@/lib/auth";

export function NewConversationView({ role }: { role: "client" | "provider" }) {
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") ?? "";
  const [recipient, setRecipient] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !to) return;
    getProfileById(to)
      .then((profile) => {
        if (profile) {
          setRecipient({ firstName: profile.firstName, lastName: profile.lastName });
        } else {
          setError("That member could not be found.");
        }
      })
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error ? reason.message : "That member is unavailable.",
        ),
      );
  }, [accessToken, to]);

  if (!to) {
    return (
      <div className="px-5 md:px-10 lg:px-14 py-8 md:py-12">
        <p role="alert" className="border border-oxblood-500/60 px-5 py-4 text-oxblood-400">
          Choose someone to message first — open a booking and use “Message”.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 md:px-10 lg:px-14 py-8 md:py-12">
        <p role="alert" className="border border-oxblood-500/60 px-5 py-4 text-oxblood-400">
          {error}
        </p>
      </div>
    );
  }

  const name = recipient
    ? `${recipient.firstName} ${recipient.lastName}`.trim() || "Faineant member"
    : "…";

  return (
    <NewConversationComposer
      recipientId={to}
      recipientName={name}
      threadHrefFor={(conversationId) =>
        `/dashboard/${role}/messages/${conversationId}`
      }
      backHref={`/dashboard/${role}/messages`}
    />
  );
}

export function NewConversationPage({ role }: { role: "client" | "provider" }) {
  return (
    <Suspense>
      <NewConversationView role={role} />
    </Suspense>
  );
}