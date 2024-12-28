export default function ChatSection({ profile, messages, setMessages }) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Bienvenido, {profile?.full_name}</h1>
      {/* Renderiza los mensajes */}
      <div className="space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      {/* Input para nuevos mensajes */}
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Escribe un mensaje"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setMessages((prev) => [...prev, { role: 'user', content: e.target.value }]);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
