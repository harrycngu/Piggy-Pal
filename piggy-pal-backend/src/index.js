/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    // --- Pre-populate KV for testing ---
    const testParentKey = "parent:test@example.com";
    const testChildKey = "child:child1";

    const testParent = await env.KV.get(testParentKey);
    if (!testParent) {
      await env.KV.put(
        testParentKey,
        JSON.stringify({
          id: "parent1",
          email: "test@example.com",
          passwordHash: "1234", // plain text for testing; use bcrypt in production
          children: ["child1"]
        })
      );
    }

    const testChild = await env.KV.get(testChildKey);
    if (!testChild) {
      await env.KV.put(
        testChildKey,
        JSON.stringify({
          id: "child1",
          name: "Alice",
          balance: 50
        })
      );
    }
    // --- End of pre-populate section ---

    const url = new URL(request.url);

    // Parent login endpoint
    if (url.pathname === "/login" && request.method === "POST") {
      const { email, password } = await request.json();
      const parentJson = await env.KV.get(`parent:${email}`);
      if (!parentJson) return new Response("Invalid login", { status: 401 });

      const parent = JSON.parse(parentJson);
      if (parent.passwordHash !== password)
        return new Response("Invalid login", { status: 401 });

      return new Response(
        JSON.stringify({ message: "Logged in" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get all children for parent
    if (url.pathname === "/children" && request.method === "GET") {
      const parentJson = await env.KV.get(testParentKey); // fetch the test parent
      if (!parentJson) return new Response("Parent not found", { status: 404 });

      const parent = JSON.parse(parentJson);

      const children = await Promise.all(
        parent.children.map(async (id) => {
          const childJson = await env.KV.get(`child:${id}`);
          return childJson ? JSON.parse(childJson) : null;
        })
      );

      return new Response(JSON.stringify(children), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Update a child balance
    if (url.pathname.startsWith("/children/") && request.method === "POST") {
      const childId = url.pathname.split("/")[2];
      const { amount } = await request.json();

      const childJson = await env.KV.get(`child:${childId}`);
      if (!childJson) return new Response("Child not found", { status: 404 });

      const child = JSON.parse(childJson);
      child.balance += amount;

      await env.KV.put(`child:${childId}`, JSON.stringify(child));

      return new Response(JSON.stringify(child), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
