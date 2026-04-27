/**
 * Etkinlikler Modülü Mock Data
 */
import { Community, Event, Notification } from './types';
import { eventDotColors } from './theme';

export const communities: Community[] = [
    { id: 'ieee', name: 'IEEE Öğrenci Kolu', logo: 'https://images.unsplash.com/photo-1581092122397-2666a10883d5?w=500', isVerified: true, description: 'Elektrik ve elektronik mühendisliği alanında faaliyet gösteren öğrenci topluluğu. Teknik atölyeler, seminerler ve projeler düzenliyoruz.', memberCount: 342 },
    { id: 'muzik', name: 'Müzik Topluluğu', logo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500', isVerified: true, description: 'Müzik severlerin bir araya geldiği topluluk. Konserler, çalgı kursları ve müzik etkinlikleri düzenliyoruz.', memberCount: 218 },
    { id: 'sanat', name: 'Sanat Topluluğu', logo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500', isVerified: true, description: 'Görsel sanatlar, tasarım ve yaratıcılık odaklı topluluk. Sergiler, atölyeler ve sanat etkinlikleri organize ediyoruz.', memberCount: 195 },
    { id: 'bilisim', name: 'Bilişim Kulübü', logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500', isVerified: true, description: 'Yazılım, yapay zeka ve teknoloji alanında çalışan topluluk. Hackathon\'lar, kodlama atölyeleri düzenliyoruz.', memberCount: 456 },
    { id: 'tiyatro', name: 'Tiyatro Topluluğu', logo: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500', isVerified: true, description: 'Sahne sanatları ve tiyatro odaklı topluluk. Oyunlar, provalar ve drama atölyeleri gerçekleştiriyoruz.', memberCount: 127 },
];

export const events: Event[] = [
    { id: '1', communityId: 'ieee', title: 'Girişimcilik Zirvesi 2026', description: 'Sektör liderlerinden ilham verici konuşmalar ve ağ kurma fırsatları için bir günlük etkinliğimize katılın.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', date: '2026-03-22', time: '18:00', location: 'Ana Oditoryum', createdAt: new Date('2026-03-10'), color: eventDotColors[0] },
    { id: '3', communityId: 'bilisim', title: 'Yapay Zeka Atölyesi', description: 'Yapay zeka ve makine öğrenmesi temellerini öğrenin.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', date: '2026-03-26', time: '14:00', location: 'Mühendislik Fakültesi B4', createdAt: new Date('2026-03-14'), color: eventDotColors[2] },
    { id: '4', communityId: 'muzik', title: 'Bahar Konseri', description: 'Üniversite orkestrası ve koromuzun muhteşem bahar konseri.', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', date: '2026-03-28', time: '20:30', location: 'Amfi Tiyatro', createdAt: new Date('2026-03-15'), color: eventDotColors[3] },
    { id: '5', communityId: 'tiyatro', title: 'Hamlet - Tiyatro Gösterisi', description: 'Shakespeare\'in ölümsüz eseri tiyatro topluluğumuz tarafından sahnelenecek.', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', date: '2026-03-30', time: '19:00', location: 'Kültür Merkezi', createdAt: new Date('2026-03-16'), color: eventDotColors[4] },
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
export const getEventsByCommunityId = (communityId: string): Event[] => events.filter(e => e.communityId === communityId);
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
