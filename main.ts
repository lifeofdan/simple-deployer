import { load } from "https://deno.land/std/dotenv/mod.ts";
const env = await load();

const port = 3001;
const redeployKey = env["REDEPLOY_KEY"];
console.log("deployment key", redeployKey);
const handler = async (request: Request): Promise<Response> => {
  const incomingUrl = new URL(request.url);
  const key = incomingUrl.searchParams.get("key");

  if (!request.url.includes("redeploy"))
    return new Response("", { status: 200 });

  if (request.method === "POST" && redeployKey && key === redeployKey) {
    try {
      await Deno.writeTextFile("./should_redeploy.txt", "true");
      return new Response("Updated redeploy status", { status: 200 });
    } catch (_error) {
      throw "Couldn't update status";
    }
  }

  if (request.method === "GET") {
    let status = "";
    try {
      status = await Deno.readTextFile("./should_redeploy.txt");
      return new Response(status, { status: 200 });
    } catch (_error) {
      throw "Couldn't read status";
    }
  }

  return new Response("", { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:3001/`);
Deno.serve({ port }, handler);
