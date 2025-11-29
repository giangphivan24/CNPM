// prisma/seed.ts

import { PrismaClient, UserRole, ConnectionStatus, EventType, Priority } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu...')

    // 1. Dọn dẹp dữ liệu cũ (Xóa theo thứ tự để tránh lỗi ràng buộc khóa ngoại)
    // Xóa dữ liệu Chat & Social
    await prisma.file.deleteMany()
    await prisma.message.deleteMany()
    await prisma.channel.deleteMany()
    await prisma.serverMember.deleteMany()
    await prisma.chatServer.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()

    // Xóa dữ liệu Lịch & Tiến độ
    await prisma.eventAssignment.deleteMany()
    await prisma.calendarEvent.deleteMany()
    await prisma.progressRecord.deleteMany()

    // Xóa dữ liệu Connection & User
    await prisma.menteeConnection.deleteMany()
    await prisma.mentorProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Đã xóa dữ liệu cũ.')

    // 2. Tạo User: MENTOR (Giả lập Gia sư)
    // Mentor 1: Trần Thị B
    const mentor1 = await prisma.user.create({
        data: {
            email: 'tranthib@example.com',
            password: 'password123', // Trong thực tế nên hash password
            name: 'Trần Thị B',
            role: UserRole.MENTOR,
            department: 'Khoa học máy tính',
            image: 'https://i.pravatar.cc/150?u=tranthib',
            bio: 'Tiến sĩ KHMT với 10 năm kinh nghiệm giảng dạy.',
            mentorProfile: {
                create: {
                    expertise: ['Data Structures', 'Algorithms', 'C++'],
                    rating: 4.8,
                    totalReviews: 15,
                    maxMentees: 10,
                    availableDays: ['Thứ 2', 'Thứ 4', 'Thứ 6']
                }
            },
            // Tạo sẵn một Chat Server cho Mentor này
            ownedServers: {
                create: {
                    name: 'Lớp Cấu Trúc Dữ Liệu',
                    description: 'Trao đổi về môn học và giải thuật',
                    channels: {
                        create: [
                            { name: 'thong-bao', type: 'TEXT' },
                            { name: 'hoi-dap', type: 'TEXT' },
                            { name: 'phong-hoc-online', type: 'VIDEO' }
                        ]
                    }
                }
            }
        }
    })

    // Mentor 2: Nguyễn A
    const mentor2 = await prisma.user.create({
        data: {
            email: 'nguyena@example.com',
            password: 'password123',
            name: 'Nguyễn A',
            role: UserRole.MENTOR,
            department: 'Kỹ thuật phần mềm',
            image: 'https://i.pravatar.cc/150?u=nguyena',
            bio: 'Thủ khoa K19, chuyên về AI và Python.',
            mentorProfile: {
                create: {
                    expertise: ['Python', 'Machine Learning', 'Calculus'],
                    rating: 4.9,
                    totalReviews: 8,
                    availableDays: ['Thứ 3', 'Thứ 5', 'Chủ nhật']
                }
            }
        }
    })

    // 3. Tạo User: MENTEE (Giả lập Sinh viên)
    const mentee1 = await prisma.user.create({
        data: {
            email: 'sinhvien1@example.com',
            password: 'password123',
            name: 'Lê Văn C',
            role: UserRole.MENTEE,
            department: 'Khoa học máy tính',
            year: 2,
            major: 'Công nghệ phần mềm'
        }
    })

    const mentee2 = await prisma.user.create({
        data: {
            email: 'sinhvien2@example.com',
            password: 'password123',
            name: 'Phạm Thị D',
            role: UserRole.MENTEE,
            department: 'Hệ thống thông tin',
            year: 1
        }
    })

    console.log('👤 Đã tạo Users (Mentors & Mentees).')

    // 4. Tạo Connection (Kết nối Mentor - Mentee)
    // Mentee 1 là học trò của Mentor 1 (Đã chấp nhận)
    await prisma.menteeConnection.create({
        data: {
            menteeId: mentee1.id,
            mentorId: mentor1.id,
            status: ConnectionStatus.ACCEPTED
        }
    })

    // Mentee 2 gửi yêu cầu cho Mentor 2 (Đang chờ duyệt)
    await prisma.menteeConnection.create({
        data: {
            menteeId: mentee2.id,
            mentorId: mentor2.id,
            status: ConnectionStatus.PENDING
        }
    })

    console.log('🔗 Đã tạo Connections.')

    // 5. Tạo Calendar Events (Thay thế cho Course Schedule cũ)
    // Tạo lịch học cho Mentor 1 và Mentee 1
    const event1 = await prisma.calendarEvent.create({
        data: {
            title: 'Học kèm Cấu trúc dữ liệu',
            description: 'Ôn tập về Danh sách liên kết và Cây nhị phân',
            startTime: new Date(new Date().setHours(9, 30, 0, 0)), // Hôm nay lúc 9:30
            endTime: new Date(new Date().setHours(11, 30, 0, 0)),  // Hôm nay lúc 11:30
            type: EventType.CLASS,
            priority: Priority.HIGH,
            location: 'Phòng H6-501',
            creatorId: mentor1.id, // Mentor tạo lịch
            assignments: {
                create: [
                    { userId: mentee1.id, status: 'ACCEPTED' }, // Gán cho Mentee 1
                    { userId: mentor1.id, status: 'ACCEPTED' }  // Gán cho chính Mentor
                ]
            }
        }
    })

    // Tạo một sự kiện Deadline
    await prisma.calendarEvent.create({
        data: {
            title: 'Nộp bài tập lớn Python',
            description: 'Nộp qua portal của trường',
            startTime: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 ngày nữa
            endTime: new Date(new Date().setDate(new Date().getDate() + 3)),
            type: EventType.DEADLINE,
            priority: Priority.URGENT,
            creatorId: mentor2.id,
            assignments: {
                create: { userId: mentee2.id, status: 'PENDING' }
            }
        }
    })

    console.log('📅 Đã tạo Calendar Events.')

    // 6. Tạo Bài viết (Post) trên bảng tin
    await prisma.post.create({
        data: {
            content: 'Chào các bạn, mình mới mở lớp ôn thi Cuối kỳ môn C++, bạn nào cần inbox nhé!',
            authorId: mentor1.id,
            published: true,
            comments: {
                create: [
                    { content: 'Em đăng ký 1 slot ạ!', authorId: mentee1.id }
                ]
            },
            reactions: {
                create: [
                    { type: 'LIKE', userId: mentee2.id }
                ]
            }
        }
    })

    console.log('📰 Đã tạo Posts.')

    console.log('✅ Seed dữ liệu thành công!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })