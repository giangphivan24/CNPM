import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'MENTEE_REQUEST' | 'MENTOR_RESPONSE' | 'EVENT_REMINDER' | 'SYSTEM';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        type: 'MENTEE_REQUEST',
        title: 'Yêu cầu học mới',
        content: 'Học viên Nguyễn Văn A muốn đăng ký học môn Toán cao cấp vào ngày 05/12/2025',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'MENTOR_RESPONSE',
        title: 'Gia sư đã xác nhận',
        content: 'Gia sư Trần Thị B đã xác nhận lịch học của bạn vào ngày 06/12/2025 lúc 14:00',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'EVENT_REMINDER',
        title: 'Nhắc nhở lịch học',
        content: 'Bạn có buổi học Lập trình Python vào ngày mai lúc 09:00',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'SYSTEM',
        title: 'Cập nhật hệ thống',
        content: 'BK Tutor vừa cập nhật phiên bản mới với nhiều tính năng hữu ích',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }, []);

  const typeConfig = {
    MENTEE_REQUEST: { bg: 'bg-blue-100', icon: '📚', color: 'text-blue-600' },
    MENTOR_RESPONSE: { bg: 'bg-green-100', icon: '✅', color: 'text-green-600' },
    EVENT_REMINDER: { bg: 'bg-orange-100', icon: '⏰', color: 'text-orange-600' },
    SYSTEM: { bg: 'bg-gray-100', icon: '🔔', color: 'text-gray-600' }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Bell className="text-[#0056b3]" />
              Thông báo
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Quản lý tất cả thông báo của bạn</p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-[#0056b3] font-medium hover:underline"
            >
              <CheckCheck size={18} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-4 text-sm font-medium transition ${
                filter === 'all'
                  ? 'text-[#0056b3] border-b-2 border-[#0056b3]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-4 text-sm font-medium transition ${
                filter === 'unread'
                  ? 'text-[#0056b3] border-b-2 border-[#0056b3]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'Tất cả thông báo đã được đọc' 
                  : 'Bạn sẽ nhận được thông báo khi có hoạt động mới'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-[#0056b3]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${typeConfig[notification.type].bg} rounded-full flex items-center justify-center text-2xl flex-shrink-0`}>
                    {typeConfig[notification.type].icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`font-bold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Đánh dấu đã đọc"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa thông báo"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
