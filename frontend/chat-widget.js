(function () {
    const API_URL = 'https://engineering-failures-archive-production.up.railway.app';
    const toggle   = document.getElementById('chatToggle');
    const panel    = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const messages = document.getElementById('chatMessages');
    const input    = document.getElementById('chatInput');
    const send     = document.getElementById('chatSend');
    let isOpen = false;
    let history = [];

    function openChat()  { isOpen = true;  panel.classList.remove('chat-hidden'); input.focus(); }
    function closeChat() { isOpen = false; panel.classList.add('chat-hidden'); }

    toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    function appendMsg(text, role) {
        const div = document.createElement('div');
        div.className = `chat-msg chat-msg-${role}`;
        div.innerHTML = marked.parse(text);
        renderMathInElement(div, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
            ],
            throwOnError: false,
        });
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    async function sendMessage() {
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';
        send.disabled = true;
        appendMsg(msg, 'user');
        const thinking = document.createElement('div');
        thinking.className = 'chat-msg chat-msg-ai chat-msg-thinking';
        thinking.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(thinking);
        messages.scrollTop = messages.scrollHeight;
        try {
            const res  = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, history }),
            });
            const data = await res.json();
            thinking.remove();
            appendMsg(data.response, 'ai');
            history.push({ role: 'user', content: msg }, { role: 'assistant', content: data.response });
            if (history.length > 10) history = history.slice(-10);
        } catch {
            thinking.remove();
            appendMsg('Could not reach the backend.', 'ai');
        } finally {
            send.disabled = false;
            input.focus();
        }
    }

    send.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
}());
