import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");
  const baseUrl = process.env.NEXTAUTH_URL ?? "";

  if (!agentId) return NextResponse.json({ error: "Missing agentId" }, { status: 400 });

  const script = `(function() {
  if (document.getElementById("aurex-widget-root")) return;
  var AGENT_ID = "${agentId}";
  var BASE_URL = "${baseUrl}";
  var SESSION_KEY = "aurex_sid_" + AGENT_ID;
  var CONTACT_KEY = "aurex_contact_" + AGENT_ID;
  var SESSION_ID = sessionStorage.getItem(SESSION_KEY) || (function(){ var id = Math.random().toString(36).slice(2)+Date.now().toString(36); sessionStorage.setItem(SESSION_KEY, id); return id; })();
  var contact = localStorage.getItem(CONTACT_KEY) || "";
  var agentName = "AI Assistant";

  // Fetch agent name
  fetch(BASE_URL + "/api/widget/" + AGENT_ID).then(function(r){ return r.json(); }).then(function(d){ if(d.name){ agentName = d.name; var h = document.getElementById("aurex-agent-name"); if(h) h.textContent = agentName; } }).catch(function(){});

  var css = [
    "#aurex-widget-root *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
    "#aurex-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#e8c97a);color:#fff;border:none;cursor:pointer;font-size:22px;box-shadow:0 4px 16px rgba(201,168,76,.5);z-index:2147483647;transition:transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center}",
    "#aurex-btn:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(201,168,76,.6)}",
    "#aurex-win{position:fixed;bottom:92px;right:24px;width:360px;height:520px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;z-index:2147483646;overflow:hidden;transform:scale(.95) translateY(8px);opacity:0;pointer-events:none;transition:transform .2s ease,opacity .2s ease}",
    "#aurex-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}",
    "#aurex-head{background:linear-gradient(135deg,#1a1400,#2d2200);padding:14px 16px;display:flex;align-items:center;gap:10px}",
    "#aurex-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#e8c97a);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}",
    "#aurex-head-info{flex:1}",
    "#aurex-agent-name{color:#fff;font-weight:600;font-size:14px;margin:0}",
    "#aurex-status{color:#c9a84c;font-size:11px;display:flex;align-items:center;gap:4px}",
    "#aurex-status-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block}",
    "#aurex-close{background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;font-size:18px;padding:4px;line-height:1;margin-left:auto}",
    "#aurex-close:hover{color:#fff}",
    "#aurex-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#fafafa}",
    "#aurex-msgs::-webkit-scrollbar{width:4px}",
    "#aurex-msgs::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}",
    ".aurex-msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;word-break:break-word}",
    ".aurex-bot{align-self:flex-start;background:#fff;color:#111;border:1px solid #e5e7eb;border-bottom-left-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.06)}",
    ".aurex-user{align-self:flex-end;background:linear-gradient(135deg,#c9a84c,#b8943e);color:#fff;border-bottom-right-radius:4px}",
    ".aurex-typing{display:flex;gap:4px;align-items:center;padding:12px 14px}",
    ".aurex-dot{width:7px;height:7px;border-radius:50%;background:#c9a84c;animation:aurex-bounce .9s infinite}",
    ".aurex-dot:nth-child(2){animation-delay:.15s}",
    ".aurex-dot:nth-child(3){animation-delay:.3s}",
    "@keyframes aurex-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}",
    "#aurex-contact-form{padding:20px;display:flex;flex-direction:column;gap:12px;background:#fff;border-top:1px solid #f0f0f0}",
    "#aurex-contact-form p{font-size:13px;color:#374151;margin:0;font-weight:500}",
    "#aurex-contact-input{padding:10px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:13px;outline:none;transition:border-color .15s}",
    "#aurex-contact-input:focus{border-color:#c9a84c}",
    "#aurex-contact-btn{padding:10px;background:linear-gradient(135deg,#c9a84c,#b8943e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .15s}",
    "#aurex-contact-btn:hover{opacity:.9}",
    "#aurex-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #f0f0f0;background:#fff}",
    "#aurex-input{flex:1;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:13px;outline:none;transition:border-color .15s;resize:none}",
    "#aurex-input:focus{border-color:#c9a84c}",
    "#aurex-send{background:linear-gradient(135deg,#c9a84c,#b8943e);color:#fff;border:none;width:38px;height:38px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}",
    "#aurex-send:hover{opacity:.9}",
    "#aurex-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "#aurex-branding{text-align:center;padding:4px 0 8px;font-size:10px;color:#9ca3af}",
    "#aurex-branding a{color:#c9a84c;text-decoration:none;font-weight:500}"
  ].join("");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement("div");
  root.id = "aurex-widget-root";
  root.innerHTML = [
    '<button id="aurex-btn" aria-label="Open chat">',
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    '</button>',
    '<div id="aurex-win" role="dialog" aria-label="Chat widget">',
      '<div id="aurex-head">',
        '<div id="aurex-avatar">✨</div>',
        '<div id="aurex-head-info">',
          '<p id="aurex-agent-name">AI Assistant</p>',
          '<span id="aurex-status"><span id="aurex-status-dot"></span> Online</span>',
        '</div>',
        '<button id="aurex-close" aria-label="Close chat">&#x2715;</button>',
      '</div>',
      '<div id="aurex-msgs"></div>',
      contact ? '' : [
        '<div id="aurex-contact-form">',
          '<p>👋 Hi there! What\'s your name or email so we can follow up?</p>',
          '<input id="aurex-contact-input" placeholder="Your name or email..." autocomplete="name email"/>',
          '<button id="aurex-contact-btn">Start Chat</button>',
        '</div>'
      ].join(""),
      contact ? '<div id="aurex-form"><input id="aurex-input" placeholder="Type a message..." autocomplete="off"/><button id="aurex-send" aria-label="Send"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>' : '',
      '<div id="aurex-branding">Powered by <a href="https://aurex.payroo.xyz" target="_blank" rel="noopener noreferrer">Aurex</a></div>',
    '</div>'
  ].join("");
  document.body.appendChild(root);

  var btn = document.getElementById("aurex-btn");
  var win = document.getElementById("aurex-win");
  var msgs = document.getElementById("aurex-msgs");
  var isOpen = false;

  btn.addEventListener("click", function() {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    btn.innerHTML = isOpen
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    if (isOpen && contact && msgs.children.length === 0) {
      addMsg("Hi! I\\'m " + agentName + ". How can I help you today?", "bot");
    }
  });

  document.getElementById("aurex-close").addEventListener("click", function() {
    isOpen = false;
    win.classList.remove("open");
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  });

  // Contact form submit
  var contactBtn = document.getElementById("aurex-contact-btn");
  if (contactBtn) {
    contactBtn.addEventListener("click", function() {
      var input = document.getElementById("aurex-contact-input");
      var val = input.value.trim();
      if (!val) { input.focus(); return; }
      contact = val;
      localStorage.setItem(CONTACT_KEY, contact);
      var cf = document.getElementById("aurex-contact-form");
      cf.parentNode.removeChild(cf);
      // Insert chat form
      var form = document.createElement("div");
      form.id = "aurex-form";
      form.innerHTML = '<input id="aurex-input" placeholder="Type a message..." autocomplete="off"/><button id="aurex-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>';
      var branding = document.getElementById("aurex-branding");
      win.insertBefore(form, branding);
      bindForm();
      addMsg("Hi " + contact.split(" ")[0].split("@")[0] + "! I\\'m " + agentName + ". How can I help you today?", "bot");
    });
    document.getElementById("aurex-contact-input").addEventListener("keydown", function(e) {
      if (e.key === "Enter") contactBtn.click();
    });
  }

  if (contact) bindForm();

  function bindForm() {
    var form = document.getElementById("aurex-form");
    var input = document.getElementById("aurex-input");
    var send = document.getElementById("aurex-send");
    if (!form || !input) return;
    function submit() {
      var msg = input.value.trim();
      if (!msg) return;
      input.value = "";
      addMsg(msg, "user");
      var typing = showTyping();
      fetch(BASE_URL + "/api/widget/" + AGENT_ID, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact, message: msg, sessionId: SESSION_ID })
      }).then(function(r){ return r.json(); }).then(function(d){
        removeTyping(typing);
        addMsg(d.reply || "Sorry, I couldn\\'t process that.", "bot");
      }).catch(function(){
        removeTyping(typing);
        addMsg("Something went wrong. Please try again.", "bot");
      });
    }
    form.addEventListener("submit", function(e){ e.preventDefault(); submit(); });
    send.addEventListener("click", submit);
    input.addEventListener("keydown", function(e){ if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); submit(); } });
  }

  function addMsg(text, role) {
    var div = document.createElement("div");
    div.className = "aurex-msg aurex-" + role;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "aurex-msg aurex-bot aurex-typing";
    div.innerHTML = '<span class="aurex-dot"></span><span class="aurex-dot"></span><span class="aurex-dot"></span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
})();
`;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
