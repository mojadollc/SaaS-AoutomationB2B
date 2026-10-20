import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");
  const baseUrl = process.env.NEXTAUTH_URL ?? "";

  if (!agentId) return NextResponse.json({ error: "Missing agentId" }, { status: 400 });

  const script = `
(function() {
  var AGENT_ID = "${agentId}";
  var BASE_URL = "${baseUrl}";
  var SESSION_ID = Math.random().toString(36).slice(2);

  var style = document.createElement("style");
  style.textContent = [
    "#af-widget-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#4f46e5;color:#fff;border:none;cursor:pointer;font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:9999}",
    "#af-widget{position:fixed;bottom:92px;right:24px;width:360px;height:500px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.15);display:none;flex-direction:column;z-index:9999;font-family:sans-serif}",
    "#af-widget.open{display:flex}",
    "#af-header{background:#4f46e5;color:#fff;padding:16px;border-radius:16px 16px 0 0;font-weight:600}",
    "#af-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px}",
    ".af-msg{max-width:80%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.4}",
    ".af-user{align-self:flex-end;background:#4f46e5;color:#fff;border-bottom-right-radius:4px}",
    ".af-bot{align-self:flex-start;background:#f3f4f6;color:#111;border-bottom-left-radius:4px}",
    "#af-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e5e7eb}",
    "#af-input{flex:1;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none}",
    "#af-send{background:#4f46e5;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:14px}"
  ].join("");
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.id = "af-widget-btn";
  btn.innerHTML = "&#128172;";
  document.body.appendChild(btn);

  var widget = document.createElement("div");
  widget.id = "af-widget";
  widget.innerHTML = '<div id="af-header">AI Assistant</div><div id="af-messages"></div><form id="af-form"><input id="af-input" placeholder="Type a message..." autocomplete="off"/><button id="af-send" type="submit">Send</button></form>';
  document.body.appendChild(widget);

  var contact = localStorage.getItem("af_contact");
  if (!contact) {
    contact = prompt("What\\'s your name or email?") || "visitor";
    localStorage.setItem("af_contact", contact);
  }

  btn.addEventListener("click", function() { widget.classList.toggle("open"); });

  document.getElementById("af-form").addEventListener("submit", function(e) {
    e.preventDefault();
    var input = document.getElementById("af-input");
    var msg = input.value.trim();
    if (!msg) return;
    input.value = "";
    addMsg(msg, "user");

    fetch(BASE_URL + "/api/widget/" + AGENT_ID, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: contact, message: msg, sessionId: SESSION_ID })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) { addMsg(d.reply, "bot"); });
  });

  function addMsg(text, role) {
    var msgs = document.getElementById("af-messages");
    var div = document.createElement("div");
    div.className = "af-msg af-" + role;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
})();
`;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
