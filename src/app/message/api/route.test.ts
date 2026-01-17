import { GET, POST } from "./route";
import { createMessage, listMessages } from "../_lib/messages";

jest.mock("../_lib/messages", () => ({
  listMessages: jest.fn(),
  createMessage: jest.fn(),
}));

const mockListMessages = jest.mocked(listMessages);
const mockCreateMessage = jest.mocked(createMessage);

describe("GET /message/api", () => {
  it("returns messages as JSON", async () => {
    mockListMessages.mockResolvedValue([
      { id: "1", subject: "Hello", body: "World" },
      { id: "2", subject: "Subject", body: "Body" },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(mockListMessages).toHaveBeenCalledTimes(1);
    await expect(response.json()).resolves.toEqual({
      messages: [
        { id: "1", subject: "Hello", body: "World" },
        { id: "2", subject: "Subject", body: "Body" },
      ],
    });
  });
});

describe("POST /message/api", () => {
  it("returns 201 and created message for valid JSON", async () => {
    mockCreateMessage.mockResolvedValue({ id: "1", subject: "Hi", body: "There" });

    const request = new Request("http://localhost/message/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject: "Hi", body: "There" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(mockCreateMessage).toHaveBeenCalledWith({ subject: "Hi", body: "There" });
    await expect(response.json()).resolves.toEqual({
      message: { id: "1", subject: "Hi", body: "There" },
    });
  });

  it("returns 400 for invalid JSON", async () => {
    const request = new Request("http://localhost/message/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON" });
  });

  it("returns 400 for invalid body", async () => {
    const request = new Request("http://localhost/message/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject: "only subject" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        error: expect.any(String),
        issues: expect.any(Array),
      }),
    );
  });

  it("returns 400 when createMessage throws", async () => {
    mockCreateMessage.mockRejectedValue(new Error("boom"));

    const request = new Request("http://localhost/message/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject: "Hi", body: "There" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "boom" });
  });
});
