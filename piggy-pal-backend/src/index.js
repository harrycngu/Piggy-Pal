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
    const url = new URL(request.url);

    // --- CORS setup ---
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Helper for consistent JSON responses with CORS
    const respondJSON = (body, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

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
          passwordHash: "1234",
          children: ["child1"],
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
          balance: 50,
        })
      );
    }

    // ---------- Parent Endpoints ----------
    if (url.pathname === "/signup" && request.method === "POST") {
      const { email, password } = await request.json();
      const existing = await env.KV.get(`parent:${email}`);
      if (existing) return new Response("Parent already exists", { status: 400, headers: corsHeaders });

      const id = `parent${Date.now()}`;
      await env.KV.put(
        `parent:${email}`,
        JSON.stringify({ id, email, passwordHash: password, children: [] })
      );
      return respondJSON({ message: "Signed up!" }, 201);
    }

    if (url.pathname === "/login" && request.method === "POST") {
      const { email, password } = await request.json();
      const parentJson = await env.KV.get(`parent:${email}`);
      if (!parentJson) return new Response("Invalid login", { status: 401, headers: corsHeaders });

      const parent = JSON.parse(parentJson);
      if (parent.passwordHash !== password)
        return new Response("Invalid login", { status: 401, headers: corsHeaders });

      return respondJSON({ message: "Logged in" });
    }

    if (url.pathname === "/children" && request.method === "GET") {
      const parentJson = await env.KV.get(testParentKey);
      if (!parentJson) return new Response("Parent not found", { status: 404, headers: corsHeaders });

      const parent = JSON.parse(parentJson);
      const children = await Promise.all(
        parent.children.map(async (id) => {
          const childJson = await env.KV.get(`child:${id}`);
          return childJson ? JSON.parse(childJson) : null;
        })
      );

      return respondJSON(children);
    }

    if (url.pathname === "/children/add" && request.method === "POST") {
      const { parentEmail, childName } = await request.json();
      const parentJson = await env.KV.get(`parent:${parentEmail}`);
      if (!parentJson) return new Response("Parent not found", { status: 404, headers: corsHeaders });

      const parent = JSON.parse(parentJson);
      const childId = `child${Date.now()}`;
      const newChild = { id: childId, name: childName, balance: 0 };
      await env.KV.put(`child:${childId}`, JSON.stringify(newChild));

      parent.children.push(childId);
      await env.KV.put(`parent:${parentEmail}`, JSON.stringify(parent));

      return respondJSON(newChild, 201);
    }

    // ---------- Chore Endpoints ----------
    // Parents adding chores
    if (url.pathname === "/chores/add" && request.method === "POST") {
      const { childId, title, reward } = await request.json();
      const choreId = `chore${Date.now()}`;
      const chore = { id: choreId, childId, title, reward, completed: false, approved: false, dateCreated: new Date().toISOString() };
      await env.KV.put(`chore:${choreId}`, JSON.stringify(chore));
      return respondJSON(chore, 201);
    }
    
    // Completes chores for child
    if (url.pathname.startsWith("/chores/") && url.pathname.endsWith("/complete") && request.method === "POST") {
      const choreId = url.pathname.split("/")[2];
      const choreJson = await env.KV.get(`chore:${choreId}`);
      if (!choreJson) return new Response("Chore not found", { status: 404, headers: corsHeaders });

      const chore = JSON.parse(choreJson);
      chore.completed = true;
      await env.KV.put(`chore:${choreId}`, JSON.stringify(chore));

      return respondJSON(chore);
    }

    // Gets list of childs' chores
    if (url.pathname.startsWith("/chores/") && request.method === "GET") {
      const pathParts = url.pathname.split("/");
      const childId = pathParts[2]; // /chores/:childId

      // List all keys in KV
      const list = await env.KV.list({ prefix: "chore:" });
      const chores = [];

      for (const key of list.keys) {
        const choreJson = await env.KV.get(key.name);
        if (choreJson) {
          const chore = JSON.parse(choreJson);
          if (chore.childId === childId) chores.push(chore);
        }
      }

      return respondJSON(chores);
    }
    // Parents approve chores
    if (url.pathname.startsWith("/chores/") && url.pathname.endsWith("/approve") && request.method === "POST") {
      const choreId = url.pathname.split("/")[2];
      const choreJson = await env.KV.get(`chore:${choreId}`);
      if (!choreJson) return new Response("Chore not found", { status: 404, headers: corsHeaders });

      const chore = JSON.parse(choreJson);
      if (!chore.completed) return new Response("Chore not completed yet", { status: 400, headers: corsHeaders });

      chore.approved = true;
      const childJson = await env.KV.get(`child:${chore.childId}`);
      const child = JSON.parse(childJson);
      child.balance += chore.reward;

      await env.KV.put(`child:${chore.childId}`, JSON.stringify(child));
      await env.KV.put(`chore:${choreId}`, JSON.stringify(chore));

      return respondJSON({ chore, child });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  },
  
};

