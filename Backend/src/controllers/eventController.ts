import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';
import { CalendarEvent, EventAssignment, EventStatus } from '@prisma/client'; // Import các kiểu dữ liệu cần thiết từ Prisma

// Thời hạn cho phép đổi lịch (ví dụ: 24 giờ = 24 * 60 * 60 * 1000 ms)
const RESCHEDULE_CUTOFF_MS = 24 * 60 * 60 * 1000; 

export const rescheduleEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    
    // 1. Lấy thông tin đầu vào
    const menteeId = req.user?.userId; // ID người dùng hiện tại (Mentee)
    const { newEventId } = req.body; // ID lịch học mới mà Mentee muốn chuyển sang
    const assignmentId = req.params.assignmentId; // ID đăng ký lịch học cũ (từ URL param)

    if (!menteeId || !newEventId || !assignmentId) {
        res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        return;
    }

    try {
        // --- 2. Xử lý logic Đổi lịch bằng Transaction ---
        const result = await prisma.$transaction(async (tx) => {
            
            // 2.1. TÌM KIẾM & XÁC THỰC ĐĂNG KÝ CŨ
            const oldAssignment = await tx.eventAssignment.findUnique({
                where: { id: assignmentId },
                include: { 
                    event: true // Lấy kèm thông tin lịch học cũ
                }
            });

            if (!oldAssignment) {
         // Nếu assignmentId không tìm thấy
                throw new Error('LỖI DỮ LIỆU: ID đăng ký cũ không tồn tại.');
            }

// Kiểm tra 2: Người dùng có quyền sở hữu không
            if (oldAssignment.userId !== menteeId) {
            // Nếu User ID trong Token không khớp với User ID trong DB
                throw new Error('LỖI QUYỀN TRUY CẬP: Người dùng hiện tại không sở hữu đăng ký này.');
            }

            const oldEvent = oldAssignment.event;
            const now = new Date();

            // 2.2. KIỂM TRA THỜI HẠN ĐỔI LỊCH (Cutoff time)
            const cutoffTime = new Date(oldEvent.startTime.getTime() - RESCHEDULE_CUTOFF_MS);
            if (now > cutoffTime) {
                throw new Error(`Bạn phải đổi lịch trước ${RESCHEDULE_CUTOFF_MS / (60 * 60 * 1000)} giờ kể từ thời gian bắt đầu của lịch cũ.`);
            }

            // 2.3. TÌM KIẾM & XÁC THỰC LỊCH HỌC MỚI
            const newEvent = await tx.calendarEvent.findUnique({
                where: { id: newEventId }
            });

            if (!newEvent) {
                throw new Error('Lịch học mới không tồn tại.');
            }

            // Kiểm tra Lịch mới đã bắt đầu chưa
            if (newEvent.startTime <= now) {
                throw new Error('Lịch học mới đã bắt đầu hoặc quá hạn đăng ký.');
            }
            
            // Tùy chọn: Kiểm tra xem lịch mới có thuộc loại/course tương tự không (Nếu bạn có thêm model Course)
            // if (newEvent.type !== oldEvent.type) { 
            //     throw new Error('Không thể đổi sang loại lịch học khác.'); 
            // }

            // 2.4. KIỂM TRA XUNG ĐỘT (Conflict Check)
            // Đảm bảo Mentee không bị trùng lịch vào giờ mới
            const conflict = await tx.eventAssignment.findFirst({
                where: {
                    userId: menteeId,
                    event: {
                        OR: [
                            // Xung đột nếu thời gian mới bị bao trùm bởi lịch khác
                            { startTime: { lt: newEvent.endTime }, endTime: { gt: newEvent.startTime } },
                        ]
                    }
                }
            });
            
            if (conflict) {
                throw new Error('Bạn đã có lịch học khác trùng với khung thời gian mới.');
            }

            // 2.5. KIỂM TRA SĨ SỐ (Capacity Check) - GIẢ ĐỊNH LỊCH HỌC LÀ CLASS/MEETING
            // Bạn sẽ cần một cột "currentAttendees" trên CalendarEvent (Nếu chưa có, cần update schema)
            // *** GIẢ ĐỊNH BẠN CÓ CỘT MAXCAPACITY TRONG CALENDAREVENT ***

            // Nếu bạn không quản lý sĩ số, bạn có thể bỏ qua bước này.
            // Nếu bạn quản lý, bạn sẽ phải thực hiện logic cập nhật tại đây.
            if (newEvent.currentAttendees >= newEvent.maxAttendees) {
                // Sĩ số đã đầy, không thể đổi lịch
                throw new Error(`Lịch học "${newEvent.title}" đã đầy, không thể chuyển sang.`);
            }
            // 2.6. THỰC HIỆN ĐỔI LỊCH (Cập nhật Assignment)
            const updatedAssignment = await tx.eventAssignment.update({
                where: { id: assignmentId },
                data: {
                    eventId: newEventId, // Gán ID lịch học mới
                    // Tùy chọn: Đặt lại trạng thái nếu cần
                    status: EventStatus.PENDING, 
                    updatedAt: now,
                },
                include: { event: true }
            });
            
            // --- TÙY CHỌN: CẬP NHẬT SĨ SỐ (Nếu có Capacity Tracking) ---
            
            // Nếu bạn đang theo dõi số lượng người tham gia trong CalendarEvent:
            // Giảm số người tham gia trong lịch cũ
            await tx.calendarEvent.update({
                where: { id: oldEvent.id },
                data: { currentAttendees: { decrement: 1 } }
            });
            
            // Tăng số người tham gia trong lịch mới
            await tx.calendarEvent.update({
                where: { id: newEventId },
                data: { currentAttendees: { increment: 1 } }
            });
            
            // ----------------------------------------------------------------

            // 2.7. TẠO THÔNG BÁO (Notification)
            await tx.notification.create({
                data: {
                    userId: menteeId,
                    type: 'EVENT_ASSIGNMENT', // Hoặc type 'RESCHEDULE_CONFIRM' mới
                    title: 'Đổi lịch thành công',
                    content: `Bạn đã đổi lịch học từ "${oldEvent.title}" sang "${newEvent.title}" thành công.`,
                    // Thêm data: { oldEventId: oldEvent.id, newEventId: newEventId } nếu cần
                    data: {}, 
                }
            });

            return updatedAssignment;

        }); // END TRANSACTION

        // --- 3. Trả về kết quả thành công ---
        res.json({ 
            message: 'Đổi lịch đã đăng ký thành công!', 
            assignment: {
                id: result.id,
                eventId: result.eventId,
                eventTitle: result.event.title,
                newStartTime: result.event.startTime
            }
        });

    } catch (error) {
        // --- 4. Xử lý lỗi ---
        console.error('Lỗi đổi lịch:', error);
        
        // Trả về thông báo lỗi chi tiết nếu nó là lỗi logic (throw new Error)
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi hệ thống khi xử lý đổi lịch.' });
        }
    }
};