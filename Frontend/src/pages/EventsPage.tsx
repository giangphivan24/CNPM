import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';

// Mock data cho events (sau này sẽ thay bằng API call)
interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'MEETING' | 'MENTORING' | 'DEADLINE' | 'PERSONAL';
  location: string;
  maxAttendees: number;
  currentAttendees: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Buổi học Toán cao cấp',
    description: 'Học về giải tích 1',
    startTime: new Date(2025, 11, 5, 9, 0),
    endTime: new Date(2025, 11, 5, 11, 0),
    type: 'MENTORING',
    location: 'Phòng H1-201',
    maxAttendees: 20,
    currentAttendees: 15
  },
  {
    id: '2',
    title: 'Workshop Lập trình Python',
    description: 'Nhập môn Python cho người mới',
    startTime: new Date(2025, 11, 7, 14, 0),
    endTime: new Date(2025, 11, 7, 17, 0),
    type: 'MEETING',
    location: 'Online - Google Meet',
    maxAttendees: 30,
    currentAttendees: 25
  },
  {
    id: '3',
    title: 'Deadline nộp bài tập',
    description: 'Bài tập về nhà tuần 5',
    startTime: new Date(2025, 11, 10, 23, 59),
    endTime: new Date(2025, 11, 10, 23, 59),
    type: 'DEADLINE',
    location: '',
    maxAttendees: 0,
    currentAttendees: 0
  }
];

const EventsPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<string>('');

  const eventTypeColors = {
    MEETING: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    MENTORING: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    DEADLINE: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    PERSONAL: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' }
  };

  const eventTypeLabels = {
    MEETING: 'Họp',
    MENTORING: 'Dạy học',
    DEADLINE: 'Deadline',
    PERSONAL: 'Cá nhân'
  };

  // Calendar Navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Render Calendar Header
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {format(currentMonth, 'MMMM yyyy', { locale: vi })}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-4 py-2 text-sm font-medium text-[#0056b3] hover:bg-blue-50 rounded-lg transition"
        >
          Hôm nay
        </button>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  // Render Days of Week
  const renderDays = () => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center text-sm font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Render Calendar Cells
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(e => isSameDay(e.startTime, cloneDay));
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition
              ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : ''}
              ${isSameDay(day, selectedDate) ? 'bg-blue-50 border-[#0056b3]' : ''}
              ${isSameDay(day, new Date()) ? 'ring-2 ring-[#0056b3] ring-inset' : ''}
            `}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className={`text-sm font-medium mb-1 ${isSameDay(day, new Date()) ? 'text-[#0056b3]' : ''}`}>
              {format(day, 'd')}
            </div>
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 mb-1 rounded truncate ${eventTypeColors[event.type].bg} ${eventTypeColors[event.type].text}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} sự kiện</div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Events for selected date
  const selectedDateEvents = events.filter(e => isSameDay(e.startTime, selectedDate));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch học & Sự kiện</h1>
            <p className="text-gray-600">Quản lý lịch học và các sự kiện của bạn</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* View Toggle */}
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'calendar' ? 'bg-[#0056b3] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Lịch
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'list' ? 'bg-[#0056b3] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Danh sách
              </button>
            </div>
            
            <button className="bg-[#0056b3] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
              <Plus size={18} />
              Thêm sự kiện
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          {/* Sidebar - Selected Date Events */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="text-[#0056b3]" size={20} />
              {format(selectedDate, 'EEEE, dd/MM', { locale: vi })}
            </h3>

            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có sự kiện</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl border ${eventTypeColors[event.type].border} ${eventTypeColors[event.type].bg}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-800">{event.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${eventTypeColors[event.type].text} font-medium`}>
                        {eventTypeLabels[event.type]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {event.location}
                        </div>
                      )}
                      {event.maxAttendees > 0 && (
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          {event.currentAttendees}/{event.maxAttendees} người
                        </div>
                      )}
                    </div>
                    {event.type === 'MENTORING' && (
                      <button className="w-full mt-3 bg-[#0056b3] text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                        Đăng ký tham gia
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Sự kiện sắp tới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${eventTypeColors[event.type].bg.replace('100', '500')}`}></div>
                  <span className="text-sm text-gray-500">
                    {format(event.startTime, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                {event.location && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
