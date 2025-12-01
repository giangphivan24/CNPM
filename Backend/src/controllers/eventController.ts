import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';
import { CalendarEvent, EventAssignment, EventStatus } from '@prisma/client'; 

const RESCHEDULE_CUTOFF_MS = 24 * 60 * 60 * 1000; 

export const rescheduleEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    const menteeId = req.user?.userId; // ID người dùng hiện tại (Mentee)
    const { newEventId } = req.body; // ID lịch học mới mà Mentee muốn chuyển sang
    const assignmentId = req.params.assignmentId; // ID đăng ký lịch học cũ (từ URL param)

    if (!menteeId || !newEventId || !assignmentId) {
        res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        return;
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const oldAssignment = await tx.eventAssignment.findUnique({
                where: { id: assignmentId },
                include: { event: true }
            });

            if (!oldAssignment) throw new Error('ID đăng ký cũ không tồn tại.');
            if (oldAssignment.userId !== menteeId) throw new Error('Bạn không có quyền thay đổi lịch này.');

            const oldEvent = oldAssignment.event;
            const now = new Date();

            // Kiểm tra thời hạn đổi lịch
            const cutoffTime = new Date(oldEvent.startTime.getTime() - RESCHEDULE_CUTOFF_MS);
            if (now > cutoffTime) {
                throw new Error(`Bạn phải đổi lịch trước ${RESCHEDULE_CUTOFF_MS / (60 * 60 * 1000)} giờ kể từ thời gian bắt đầu của lịch cũ.`);
            }

            // Tìm kiếm & Xác thực lịch mới
            const newEvent = await tx.calendarEvent.findUnique({
                where: { id: newEventId }
            });

            if (!newEvent) throw new Error('Lịch học mới không tồn tại.');
            
            // Kiểm tra Lịch mới đã bắt đầu chưa
            if (newEvent.startTime <= now) throw new Error('Lịch học mới đã bắt đầu hoặc quá hạn đăng ký.');

            // Đảm bảo Mentee không bị trùng lịch vào giờ mới
            const conflict = await tx.eventAssignment.findFirst({
                where: {
                    userId: menteeId,
                    id: { not: assignmentId }, // Loại trừ chính nó
                    status: { not: EventStatus.DECLINED }, // Chỉ check các lịch đã nhận hoặc đang chờ

                    event: {
                        // Trùng lịch: (StartA < EndB) && (EndA > StartB)
                        startTime: { lt: newEvent.endTime }, 
                        endTime: { gt: newEvent.startTime } 
                    },
                }
            });
            
            if (conflict) throw new Error('Bạn bị trùng lịch với một lớp học khác vào khung giờ này.');

            // check sĩ số
            // Sĩ số đã đầy -> không thể đổi lịch
            if (newEvent.currentAttendees >= newEvent.maxAttendees) {
                throw new Error(`Lịch học "${newEvent.title}" đã đầy, không thể chuyển sang.`);
            }

            // Update
            const updatedAssignment = await tx.eventAssignment.update({
                where: { id: assignmentId },
                data: {
                    eventId: newEventId,
                    status: EventStatus.PENDING, 
                    updatedAt: now,
                },
                include: { event: true }
            });
            
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
            
            // Notification
            await tx.notification.create({
                data: {
                    userId: menteeId,
                    type: 'EVENT_ASSIGNMENT', 
                    title: 'Đổi lịch thành công',
                    content: `Bạn đã đổi lịch học từ "${oldEvent.title}" sang "${newEvent.title}" thành công.`,
                    data: {}, 
                }
            });

            return updatedAssignment;

        }); 

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
        console.error('Lỗi đổi lịch:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi hệ thống khi xử lý đổi lịch.' });
        }
    }
};