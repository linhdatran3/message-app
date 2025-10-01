import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "messages.json");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ channel: string }> }
) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const { channel } = await params;
  return Response.json(data.channels[channel] || []);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ channel: string }> }
) {
  const body = await req.json(); // {id, user, text, createdAt}
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const { channel } = await params;

  if (!data.channels[channel]) {
    data.channels[channel] = [];
  }
  data.channels[channel].push(body);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json(body, { status: 201 });
}
