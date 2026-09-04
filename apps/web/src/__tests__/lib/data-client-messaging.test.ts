import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => {
  const chain = () => {
    const state: {
      select: ReturnType<typeof vi.fn>;
      eq: ReturnType<typeof vi.fn>;
      order: ReturnType<typeof vi.fn>;
      in: ReturnType<typeof vi.fn>;
      limit: ReturnType<typeof vi.fn>;
      then: ReturnType<typeof vi.fn>;
    } = {
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      in: vi.fn(),
      limit: vi.fn(),
      then: vi.fn(),
    };
    const result = { data: null as unknown, error: null as unknown };
    for (const method of ["select", "eq", "order", "in", "limit"] as const) {
      state[method].mockImplementation(() => chainable);
    }
    state.then.mockImplementation((resolve: unknown) =>
      Promise.resolve(result).then(resolve as () => void),
    );
    const chainable = {
      select: state.select,
      eq: state.eq,
      order: state.order,
      in: state.in,
      limit: state.limit,
      then: state.then,
    } as unknown as Record<string, ReturnType<typeof vi.fn>>;
    return { chainable, state, result };
  };
  return { chain, getUser: vi.fn(), rpc: vi.fn() };
});

vi.mock("@/lib/supabase/client", () => {
  const from = vi.fn();
  return {
    createClient: () => ({
      auth: { getUser: supabaseMocks.getUser },
      rpc: supabaseMocks.rpc,
      from,
    }),
  };
});

import {
  getConversationMessages,
  markConversationRead,
  sendMessage,
} from "@/lib/data-client";

const CONVERSATION_ID = "11111111-1111-4111-8111-111111111111";
const RECIPIENT_ID = "22222222-2222-4222-8222-222222222222";

function makeQuery(result: { data?: unknown; error?: unknown } = {}) {
  const query: Record<string, unknown> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.order = vi.fn(() => query);
  query.then = (resolve: () => void) =>
    Promise.resolve({
      data: result.data ?? null,
      error: result.error ?? null,
    }).then(resolve);
  return query;
}

describe("sendMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the send_message RPC and returns the created message", async () => {
    const created = {
      id: "m1",
      conversation_id: CONVERSATION_ID,
      sender_id: "s1",
      text: "hello",
      image_url: null,
      read_at: null,
      created_at: "2026-09-01T00:00:00Z",
    };
    supabaseMocks.rpc.mockResolvedValue({ data: created, error: null });

    const message = await sendMessage({ recipientId: RECIPIENT_ID, text: "hello" });

    expect(supabaseMocks.rpc).toHaveBeenCalledWith("send_message", {
      p_recipient_id: RECIPIENT_ID,
      p_text: "hello",
    });
    expect(message.id).toBe("m1");
    expect(message.conversationId).toBe(CONVERSATION_ID);
  });

  it("throws on RPC error", async () => {
    supabaseMocks.rpc.mockResolvedValue({
      data: null,
      error: { message: "Recipient not found" },
    });
    await expect(
      sendMessage({ recipientId: RECIPIENT_ID, text: "hello" }),
    ).rejects.toThrow("Recipient not found");
  });

  it("rejects text the shared schema rejects (empty)", async () => {
    await expect(
      sendMessage({ recipientId: RECIPIENT_ID, text: "" }),
    ).rejects.toThrow();
    expect(supabaseMocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects text over 2000 characters", async () => {
    await expect(
      sendMessage({ recipientId: RECIPIENT_ID, text: "x".repeat(2001) }),
    ).rejects.toThrow();
    expect(supabaseMocks.rpc).not.toHaveBeenCalled();
  });
});

describe("getConversationMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("selects messages for the conversation ordered oldest to newest", async () => {
    const query = makeQuery({
      data: [
        {
          id: "m1",
          conversation_id: CONVERSATION_ID,
          sender_id: "s1",
          text: "first",
          image_url: null,
          read_at: "2026-09-01T00:00:00Z",
          created_at: "2026-09-01T00:00:00Z",
        },
      ],
    });
    const createClient = (await import("@/lib/supabase/client")) as unknown as {
      createClient: () => { from: ReturnType<typeof vi.fn> };
    };
    const client = createClient.createClient();
    client.from.mockReturnValue(query);

    const messages = await getConversationMessages(CONVERSATION_ID);

    expect(client.from).toHaveBeenCalledWith("messages");
    expect(query.select).toHaveBeenCalledWith(
      "id,conversation_id,sender_id,text,image_url,read_at,created_at",
    );
    expect(query.eq).toHaveBeenCalledWith("conversation_id", CONVERSATION_ID);
    expect(query.order).toHaveBeenCalledWith("created_at", { ascending: true });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      id: "m1",
      senderId: "s1",
      text: "first",
    });
  });
});

describe("markConversationRead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the mark_conversation_read RPC", async () => {
    supabaseMocks.rpc.mockResolvedValue({ data: 2, error: null });
    await markConversationRead(CONVERSATION_ID);
    expect(supabaseMocks.rpc).toHaveBeenCalledWith("mark_conversation_read", {
      p_conversation_id: CONVERSATION_ID,
    });
  });

  it("throws on RPC error", async () => {
    supabaseMocks.rpc.mockResolvedValue({
      data: null,
      error: { message: "Not a participant" },
    });
    await expect(markConversationRead(CONVERSATION_ID)).rejects.toThrow(
      "Not a participant",
    );
  });
});