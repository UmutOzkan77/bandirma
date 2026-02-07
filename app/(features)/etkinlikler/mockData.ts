/**
 * Etkinlikler Modülü Mock Data
 */
import { Community, Event, Notification } from './types';
import { eventDotColors } from './theme';

export const communities: Community[] = [
    { id: 'ieee', name: 'IEEE Öğrenci Kolu', logo: 'https://i.imgur.com/8JXzqHq.png', isVerified: true },
    { id: 'muzik', name: 'Müzik Topluluğu', logo: 'https://i.imgur.com/vQN4YKJ.png', isVerified: true },
    { id: 'sanat', name: 'Sanat ve Tasarım Topluluğu', logo: 'https://i.imgur.com/kYz8xPe.png', isVerified: true },
    { id: 'bilisim', name: 'Bilişim Kulübü', logo: 'https://i.imgur.com/N5W3Rz2.png', isVerified: true },
    { id: 'tiyatro', name: 'Tiyatro Topluluğu', logo: 'https://i.imgur.com/YZxKvdT.png', isVerified: true },
];

export const events: Event[] = [
    { id: '1', communityId: 'ieee', title: 'Girişimcilik Zirvesi 2024', description: 'Sektör liderlerinden ilham verici konuşmalar ve ağ kurma fırsatları için bir günlük etkinliğimize katılın.', image: 'https://i.imgur.com/Q8K2Zw1.png', date: '2024-10-12', time: '18:00', location: 'Ana Oditoryum', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), color: eventDotColors[0] },
    { id: '2', communityId: 'sanat', title: 'Sanat Sergisi Açılışı', description: 'Öğrenci sanatçılarımızın eserlerinin sergileneceği açılış etkinliği.', image: 'https://i.imgur.com/wXpL8zR.png', date: '2024-10-12', time: '14:00', location: 'Sanat Galerisi', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), color: eventDotColors[1] },
    { id: '3', communityId: 'bilisim', title: 'Yapay Zeka Atölyesi', description: 'Yapay zeka ve makine öğrenmesi temellerini öğrenin.', image: 'https://i.imgur.com/KpNx9Zq.png', date: '2024-05-14', time: '14:00', endTime: '16:30', location: 'Mühendislik Fakültesi B4', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), color: eventDotColors[2] },
    { id: '4', communityId: 'muzik', title: 'Güz Konseri', description: 'Üniversite orkestrası ve koromuzun muhteşem güz konseri.', image: 'https://i.imgur.com/M2Lz8xY.png', date: '2024-05-14', time: '20:30', location: 'Amfi Tiyatro', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), color: eventDotColors[3] },
    { id: '5', communityId: 'tiyatro', title: 'Hamlet - Tiyatro Gösterisi', description: 'Shakespeare\'in ölümsüz eseri tiyatro topluluğumuz tarafından sahnelenecek.', image: 'https://i.imgur.com/J8Kz2xP.png', date: '2024-05-03', time: '19:00', location: 'Kültür Merkezi', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), color: eventDotColors[4] },
    { id: '6', communityId: 'ieee', title: 'Robotik Workshop', description: 'Arduino ve robotik programlama temelleri.', image: 'https://i.imgur.com/N5Rz4xS.png', date: '2024-05-09', time: '13:00', location: 'Elektrik Mühendisliği Lab', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), color: eventDotColors[1] },
    { id: '7', communityId: 'bilisim', title: 'Hackathon 2024', description: '24 saatlik kodlama maratonu. Takımınızla katılın!', image: 'https://i.imgur.com/P7Tz5xU.png', date: '2024-05-15', time: '09:00', location: 'Bilgisayar Mühendisliği', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), color: eventDotColors[2] },
    { id: '8', communityId: 'sanat', title: 'Resim Kursu', description: 'Yağlı boya resim tekniklerini öğrenin.', image: 'https://i.imgur.com/R9Vz6xW.png', date: '2024-05-22', time: '15:00', location: 'Güzel Sanatlar Atölyesi', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), color: eventDotColors[3] },
    { id: '9', communityId: 'muzik', title: 'Açık Mikrofon Gecesi', description: 'Yeteneklerinizi sergileyebileceğiniz açık mikrofon etkinliği.', image: 'https://i.imgur.com/S1Wz7xX.png', date: '2024-05-25', time: '21:00', location: 'Öğrenci Merkezi', createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), color: eventDotColors[4] },
    { id: '10', communityId: 'tiyatro', title: 'Drama Atölyesi', description: 'Temel oyunculuk teknikleri ve sahne korkusunu yenme.', image: 'https://i.imgur.com/T3Xz8xY.png', date: '2024-05-06', time: '16:00', location: 'Drama Stüdyosu', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), color: eventDotColors[0] },
    { id: '11', communityId: 'ieee', title: 'Kariyer Günleri', description: 'Sektör profesyonelleriyle networking fırsatı.', image: 'https://i.imgur.com/U5Yz9xZ.png', date: '2024-05-01', time: '10:00', endTime: '17:00', location: 'Kongre Merkezi', createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), color: eventDotColors[1] },
];

export const notifications: Notification[] = [
    { id: '1', type: 'timeChange', title: 'Etkinlik Saati Değişti', description: 'Yapay Zeka Semineri saati 14:00 olarak güncellendi.', eventId: '3', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), isRead: false },
    { id: '2', type: 'dateChange', title: 'Etkinlik Tarihi Güncellendi', description: 'Kariyer Günleri etkinliği 25 Mayıs tarihine ertelendi.', eventId: '11', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), isRead: false },
    { id: '3', type: 'cancelled', title: 'Etkinlik İptal Edildi', description: 'Hava koşulları nedeniyle Outdoor Konseri iptal edilmiştir.', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), isRead: true },
    { id: '4', type: 'newEvent', title: 'Yeni Etkinlik Yayında', description: 'Girişimcilik Zirvesi için kayıtlar açıldı! Kaçırmayın.', eventId: '1', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), isRead: true },
    { id: '5', type: 'locationChange', title: 'Mekan Değişikliği', description: 'Tiyatro provası Amfi 1 yerine B Blok Toplantı Salonu\'nda yapılacaktır.', eventId: '5', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), isRead: true },
    { id: '6', type: 'reminder', title: 'Etkinlik Hatırlatması', description: 'Yapay Zeka Atölyesi yarın saat 14:00\'te başlayacak.', eventId: '3', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isRead: true },
    { id: '7', type: 'newEvent', title: 'Yeni Etkinlik Yayında', description: 'Güz Konseri biletleri satışa çıktı!', eventId: '4', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), isRead: true },
    { id: '8', type: 'reminder', title: 'Son 1 Saat Kaldı', description: 'Robotik Workshop 1 saat sonra başlayacak.', eventId: '6', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), isRead: true },
];

export const getCommunityById = (id: string): Community | undefined => communities.find(c => c.id === id);
export const getEventsByDate = (date: string): Event[] => events.filter(e => e.date === date);
export const getEventById = (id: string): Event | undefined => events.find(e => e.id === id);

export const getEventDates = (): Map<string, Event[]> => {
    const dateMap = new Map<string, Event[]>();
    events.forEach(event => {
        const existing = dateMap.get(event.date) || [];
        dateMap.set(event.date, [...existing, event]);
    });
    return dateMap;
};

export const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 60) return `${diffMins}dk önce`;
    if (diffHours < 24) return `${diffHours}sa önce`;
    return `${diffDays}g önce`;
};

export const formatDateTurkish = (dateStr: string): string => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const date = new Date(dateStr);
    return `${date.getDate()} ${months[date.getMonth()]}`;
};
