"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  Calendar,
  Instagram,
  Link2,
  Unlink,
  ExternalLink,
  CheckCircle2,
  Clock,
  Image,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "connected" | "disconnected";
  connectedAt?: string;
  details?: string;
}

export default function IntegrationsPage() {
  const { accessToken } = useAuth();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: "google-calendar",
      name: "Google Calendar",
      description:
        "Two-way sync your Arc bookings with Google Calendar. External events automatically block your availability so you never double-book.",
      icon: Calendar,
      status: "disconnected",
    },
    {
      id: "instagram",
      name: "Instagram",
      description:
        "Connect your Instagram to automatically import your latest posts into your Arc portfolio. Keep your portfolio fresh without lifting a finger.",
      icon: Instagram,
      status: "disconnected",
    },
  ];

  async function handleConnect(integrationId: string) {
    setConnecting(integrationId);
    setError(null);
    setSuccess(null);
    try {
      if (integrationId === "google-calendar") {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        window.location.href = `${apiUrl}/calendar/auth/google?token=${accessToken}`;
        return;
      }
      if (integrationId === "instagram") {
        setError(
          "Instagram integration is coming soon. We're working with Meta's API team to bring this to Arc.",
        );
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setConnecting(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">
        Integrations
      </h1>
      <p className="mt-1 text-body-sm text-espresso-400">
        Connect your favorite tools to streamline your workflow and keep
        everything in sync.
      </p>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 border border-[#3b7a57]/20 bg-[#3b7a57]/10 px-4 py-3 text-sm text-[#3b7a57]">
          {success}
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="border-espresso-200/60 bg-ivory-50"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-brass-100">
                    <integration.icon className="h-5 w-5 text-brass-600" />
                  </div>
                  <div>
                    <CardTitle className="text-espresso-800">
                      {integration.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-espresso-400">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={`shrink-0 gap-1.5 border-transparent ${
                    integration.status === "connected"
                      ? "bg-[#3b7a57]/10 text-[#3b7a57]"
                      : "bg-espresso-100 text-espresso-400"
                  }`}
                >
                  {integration.status === "connected" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Not connected
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {integration.status === "connected" ? (
                <div className="flex items-center justify-between rounded bg-ivory-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-espresso-800">
                      {integration.details || "Connected"}
                    </p>
                    {integration.connectedAt && (
                      <p className="text-xs text-espresso-400">
                        Connected{" "}
                        {new Date(integration.connectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button variant="arc-outline" size="sm">
                    <Unlink className="h-3.5 w-3.5" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  variant="arc"
                  onClick={() => handleConnect(integration.id)}
                  disabled={connecting === integration.id}
                  className="gap-2"
                >
                  <Link2 className="h-4 w-4" />
                  {connecting === integration.id
                    ? "Connecting\u2026"
                    : `Connect ${integration.name}`}
                </Button>
              )}

              {/* Feature list */}
              <div className="mt-4 space-y-2">
                {integration.id === "google-calendar" && (
                  <>
                    <FeatureRow icon={CheckCircle2} text="Block time from external events" />
                    <FeatureRow icon={CheckCircle2} text="Arc bookings appear in Google Calendar" />
                    <FeatureRow icon={CheckCircle2} text="Real-time push sync" />
                  </>
                )}
                {integration.id === "instagram" && (
                  <>
                    <FeatureRow icon={Image} text="Auto-import recent posts to portfolio" />
                    <FeatureRow icon={ExternalLink} text="Link back to your Instagram profile" />
                    <FeatureRow icon={Clock} text="Syncs every 15 minutes" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming soon */}
      <div className="mt-8 border-t border-espresso-200/40 pt-6">
        <h2 className="font-serif text-lg text-espresso-800">Coming soon</h2>
        <p className="mt-1 text-sm text-espresso-400">
          More integrations are on the way.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {["Apple Calendar", "Booksy", "Square", "Vagaro", "TikTok"].map(
            (name) => (
              <div
                key={name}
                className="border border-espresso-200/60 bg-ivory-100 px-4 py-2 text-sm text-espresso-400"
              >
                {name}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-espresso-500">
      <Icon className="h-3.5 w-3.5 text-brass-600" />
      {text}
    </div>
  );
}
