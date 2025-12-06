import React, { useState } from 'react';
import { MessageCircle, Users, Send, Search, Plus, Settings, Hash } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'group' | 'direct';
  lastMessage: string;
  unread: number;
  avatar?: string;
}

const ForumPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const channels: Channel[] = [
    { id: '1', name: 'Toán cao cấp A1', type: 'group', lastMessage: 'Bài tập hôm nay làm như thế nào ạ?', unread: 3 },
    { id: '2', name: 'Lập trình Python', type: 'group', lastMessage: 'Em đã hiểu rồi ạ, cảm ơn thầy!', unread: 0 },
    { id: '3', name: 'Nguyễn Văn A', type: 'direct', lastMessage: 'Em sẽ gửi bài tập qua email ạ', unread: 1 },
    { id: '4', name: 'Vật lý đại cương', type: 'group', lastMessage: 'Hôm nay học phần nào ạ?', unread: 0 },
  ];

  const messages: Message[] = [
    { id: '1', sender: 'Nguyễn Văn B', content: 'Chào mọi người, hôm nay ai đã làm bài tập chưa ạ?', time: '09:00', isMine: false },
    { id: '2', sender: 'Bạn', content: 'Mình làm được 3 câu rồi, còn lại hơi khó', time: '09:05', isMine: true },
    { id: '3', sender: 'Trần Thị C', content: 'Câu 4 giải theo phương pháp tích phân nha', time: '09:10', isMine: false },
    { id: '4', sender: 'Nguyễn Văn B', content: 'Cảm ơn bạn! Mình sẽ thử lại', time: '09:12', isMine: false },
    { id: '5', sender: 'Bạn', content: 'Mọi người xem video bài giảng tuần trước chưa? Thầy giải thích rất hay', time: '09:15', isMine: true },
    { id: '6', sender: 'Lê Văn D', content: 'Rồi ạ, phần tích phân từng phần thầy giảng dễ hiểu lắm', time: '09:20', isMine: false },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // TODO: Send message via API
    setMessageInput('');
  };

  const selectedChannelData = channels.find(c => c.id === selectedChannel);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-160px)]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Diễn đàn</h2>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Plus size={20} className="text-gray-600" />
                  </button>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0056b3] outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Channel List */}
              <div className="flex-1 overflow-y-auto">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`p-4 cursor-pointer transition border-l-4 ${
                      selectedChannel === channel.id
                        ? 'bg-blue-50 border-l-[#0056b3]'
                        : 'border-l-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        channel.type === 'group' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {channel.type === 'group' 
                          ? <Hash size={18} className="text-blue-600" />
                          : <span className="text-green-600 font-bold">{channel.name.charAt(0)}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800 truncate">{channel.name}</h4>
                          {channel.unread > 0 && (
                            <span className="bg-[#0056b3] text-white text-xs px-2 py-0.5 rounded-full">
                              {channel.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{channel.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChannelData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedChannelData.type === 'group' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {selectedChannelData.type === 'group' 
                          ? <Hash size={18} className="text-blue-600" />
                          : <span className="text-green-600 font-bold">{selectedChannelData.name.charAt(0)}</span>
                        }
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{selectedChannelData.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedChannelData.type === 'group' ? '25 thành viên' : 'Trực tuyến'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Users size={20} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Settings size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${message.isMine ? 'order-2' : 'order-1'}`}>
                          {!message.isMine && (
                            <p className="text-xs text-gray-500 mb-1 ml-1">{message.sender}</p>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl ${
                            message.isMine 
                              ? 'bg-[#0056b3] text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-800 rounded-bl-md'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 ${message.isMine ? 'text-right mr-1' : 'ml-1'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3] outline-none"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="p-3 bg-[#0056b3] text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Chọn cuộc trò chuyện</h3>
                    <p className="text-gray-500">Chọn một kênh hoặc tin nhắn để bắt đầu</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
