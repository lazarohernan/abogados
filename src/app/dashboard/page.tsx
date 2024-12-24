// Componente de Sidebar mejorado
const Sidebar = ({ profile, chatHistory }: { profile: UserProfile | null, chatHistory: ChatMessage[] }) => (
  <div className="md:col-span-1 space-y-6">
    {/* Perfil del Usuario */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-xl font-bold text-blue-600">
            {profile?.full_name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{profile?.full_name}</h3>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Estado</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            profile?.subscription_status === 'trial' 
              ? 'bg-yellow-100 text-yellow-800' 
              : profile?.subscription_status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {profile?.subscription_status === 'trial' 
              ? 'Prueba Gratuita' 
              : profile?.subscription_status === 'active'
              ? 'Activo'
              : 'Inactivo'}
          </span>
        </div>
        {profile?.trial_end && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Expira</span>
            <span className="text-sm font-medium">
              {new Date(profile.trial_end).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Estadísticas */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Consultas</span>
            <span className="text-lg font-semibold text-gray-900">
              {chatHistory.filter(msg => msg.role === 'user').length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${Math.min(chatHistory.filter(msg => msg.role === 'user').length * 10, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Documentos</span>
            <span className="text-lg font-semibold text-gray-900">0</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full w-0"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Enlaces Rápidos */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
      <div className="space-y-2">
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Documentos Recientes</span>
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nueva Consulta</span>
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configuración</span>
        </button>
      </div>
    </div>
  </div>
);

// Chat mejorado con indicador de escritura y formato de mensajes
const ChatMessage = ({ message }: { message: ChatMessage }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    {message.role === 'assistant' && (
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
        <span className="text-sm font-medium text-blue-600">AI</span>
      </div>
    )}
    <div
      className={`max-w-[70%] p-4 rounded-xl ${
        message.role === 'user'
          ? 'bg-blue-600 text-white ml-2'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="prose prose-sm">
        {message.content}
      </div>
      <div className="mt-1 text-xs opacity-70">
        {message.created_at && new Date(message.created_at).toLocaleTimeString()}
      </div>
    </div>
    {message.role === 'user' && (
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
        <span className="text-sm font-medium text-gray-600">
          {/* Primera letra del nombre del usuario */}
          U
        </span>
      </div>
    )}
  </div>
);

// Continuará en la siguiente parte...
