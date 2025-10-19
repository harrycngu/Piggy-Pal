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
          passwordHash: "1234", // plain text for testing
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
    // --- End pre-populate ---

    /** ----------------- Parent Endpoints ----------------- */

    // Parent signup
    if (url.pathname === "/signup" && request.method === "POST") {
      const { email, password } = await request.json();
      const existing = await env.KV.get(`parent:${email}`);
      if (existing) return new Response("Parent already exists", { status: 400 });

      const id = `parent${Date.now()}`;
      await env.KV.put(
        `parent:${email}`,
        JSON.stringify({ id, email, passwordHash: password, children: [] })
      );
      return new Response(JSON.stringify({ message: "Signed up!" }), { status: 201 });
    }

    // Parent login
    if (url.pathname === "/login" && request.method === "POST") {
      const { email, password } = await request.json();
      const parentJson = await env.KV.get(`parent:${email}`);
      if (!parentJson) return new Response("Invalid login", { status: 401 });

      const parent = JSON.parse(parentJson);
      if (parent.passwordHash !== password)
        return new Response("Invalid login", { status: 401 });

      return new Response(JSON.stringify({ message: "Logged in" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Get all children for parent
    if (url.pathname === "/children" && request.method === "GET") {
      const parentJson = await env.KV.get(testParentKey); // temp for testing
      if (!parentJson) return new Response("Parent not found", { status: 404 });

      const parent = JSON.parse(parentJson);
      const children = await Promise.all(
        parent.children.map(async id => {
          const childJson = await env.KV.get(`child:${id}`);
          return childJson ? JSON.parse(childJson) : null;
        })
      );

      return new Response(JSON.stringify(children), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Add a child
    if (url.pathname === "/children/add" && request.method === "POST") {
      const { parentEmail, childName } = await request.json();
      const parentJson = await env.KV.get(`parent:${parentEmail}`);
      if (!parentJson) return new Response("Parent not found", { status: 404 });

      const parent = JSON.parse(parentJson);
      const childId = `child${Date.now()}`;
      const newChild = { id: childId, name: childName, balance: 0 };
      await env.KV.put(`child:${childId}`, JSON.stringify(newChild));

      parent.children.push(childId);
      await env.KV.put(`parent:${parentEmail}`, JSON.stringify(parent));

      return new Response(JSON.stringify(newChild), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    /** ----------------- Chore Endpoints ----------------- */

    // Add a chore
    if (url.pathname === "/chores/add" && request.method === "POST") {
      const { childId, title, reward } = await request.json();
      const choreId = `chore${Date.now()}`;
      const chore = { id: choreId, childId, title, reward, completed: false, approved: false, dateCreated: new Date().toISOString() };
      await env.KV.put(`chore:${choreId}`, JSON.stringify(chore));
      return new Response(JSON.stringify(chore), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    // Child marks chore complete
    if (url.pathname.startsWith("/chores/") && url.pathname.endsWith("/complete") && request.method === "POST") {
      const choreId = url.pathname.split("/")[2];
      const choreJson = await env.KV.get(`chore:${choreId}`);
      if (!choreJson) return new Response("Chore not found", { status: 404 });

      const chore = JSON.parse(choreJson);
      chore.completed = true;
      await env.KV.put(`chore:${choreId}`, JSON.stringify(chore));

      return new Response(JSON.stringify(chore), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Parent approves chore
    if (url.pathname.startsWith("/chores/") && url.pathname.endsWith("/approve") && request.method === "POST") {
      const choreId = url.pathname.split("/")[2];
      const choreJson = await env.KV.get(`chore:${choreId}`);
      if (!choreJson) return new Response("Chore not found", { status: 404 });

      const chore = JSON.parse(choreJson);
      if (!chore.completed) return new Response("Chore not completed yet", { status: 400 });

      chore.approved = true;

      // Update child balance
      const childJson = await env.KV.get(`child:${chore.childId}`);
      const child = JSON.parse(childJson);
      child.balance += chore.reward;

      await env.KV.put(`child:${chore.childId}`, JSON.stringify(child));
      await env.KV.put(`chore:${choreId}`, JSON.stringify(chore));

      return new Response(JSON.stringify({ chore, child }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response("Not found", { status: 404 });
  }
};
