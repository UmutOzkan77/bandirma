/**
 * FeedbackScreen
 * Öğrenci Geri Bildirimleri ekranı - Tasarım 5
 * Yorum kartları, filtreleme ve yeni yorum ekleme
 * Yorumlar Supabase ile kalıcı olarak kaydedilir
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { feedbackData, Feedback } from '../mockData';
import { fetchFeedback, addFeedback } from '../api';
import FeedbackCard from '../components/FeedbackCard';

type SortOption = 'helpful' | 'recent' | 'positive' | 'negative';
type CategoryOption = 'ANA YEMEK' | 'ÇORBA' | 'TATLI' | 'YAN ÜRÜN' | 'İÇECEK' | 'GENEL';

interface FeedbackScreenProps {
    onGoBack?: () => void;
}

export default function FeedbackScreen({ onGoBack }: FeedbackScreenProps) {
    const [sortBy, setSortBy] = useState<SortOption>('helpful');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock');

    // Yorum ekleme state'leri
    const [showAddModal, setShowAddModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('GENEL');
    const [mealName, setMealName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Yorumlar listesi (local state)
    const [comments, setComments] = useState<Feedback[]>(feedbackData);

    const sortOptions: { key: SortOption; label: string }[] = [
        { key: 'helpful', label: 'En Faydalılar' },
        { key: 'recent', label: 'En Yeniler' },
        { key: 'positive', label: 'En Olumlular' },
        { key: 'negative', label: 'En Olumsuzlar' },
    ];

    const categoryOptions: CategoryOption[] = [
        'GENEL', 'ANA YEMEK', 'ÇORBA', 'TATLI', 'YAN ÜRÜN', 'İÇECEK'
    ];

    const currentSortLabel = sortOptions.find(opt => opt.key === sortBy)?.label || 'Sırala';

    // Yorumları Supabase'den yükle
    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            const data = await fetchFeedback();
            if (data && data.length > 0) {
                const mapped: Feedback[] = data.map((item: any) => ({
                    id: item.id,
                    userId: item.student_id || 'anonymous',
                    mealTime: item.meal_time || 'lunch',
                    category: item.category,
                    mealName: item.meal_name,
                    comment: item.comment,
                    likes: item.likes || 0,
                    dislikes: item.dislikes || 0,
                    timeAgo: getTimeAgo(item.created_at),
                }));
                setComments(mapped);
                setDataSource('supabase');
                console.log('✅ Yorumlar Supabase\'den yüklendi');
            } else {
                console.log('ℹ️ Supabase\'de yorum yok, mock data kullanılıyor');
            }
        } catch (error) {
            console.log('⚠️ Yorumlar yüklenemedi, mock data kullanılıyor');
        } finally {
            setIsLoading(false);
        }
    };

    // Zaman farkını hesapla
    const getTimeAgo = (dateStr: string): string => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Az önce';
        if (diffMin < 60) return `${diffMin} dk önce`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour} saat önce`;
        const diffDay = Math.floor(diffHour / 24);
        return `${diffDay} gün önce`;
    };

    // Yorum ekleme fonksiyonu
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            Alert.alert('Uyarı', 'Lütfen bir yorum yazın.');
            return;
        }

        setIsSaving(true);

        try {
            // Supabase'e kaydet
            const result = await addFeedback({
                meal_time: 'lunch',
                category: selectedCategory,
                meal_name: mealName || 'Genel Değerlendirme',
                comment: newComment.trim(),
            });

            if (result) {
                // Supabase'den dönen veriyi listeye ekle
                const newFeedback: Feedback = {
                    id: result.id,
                    userId: 'currentUser',
                    mealTime: 'lunch',
                    category: selectedCategory,
                    mealName: mealName || 'Genel Değerlendirme',
                    comment: newComment.trim(),
                    likes: 0,
                    dislikes: 0,
                    timeAgo: 'Az önce',
                };
                setComments(prev => [newFeedback, ...prev]);
                Alert.alert('Başarılı', 'Yorumunuz Supabase\'e kaydedildi! 🎉');
            } else {
                // Fallback: local olarak ekle
                const localFeedback: Feedback = {
                    id: `local-${Date.now()}`,
                    userId: 'currentUser',
                    mealTime: 'lunch',
                    category: selectedCategory,
                    mealName: mealName || 'Genel Değerlendirme',
                    comment: newComment.trim(),
                    likes: 0,
                    dislikes: 0,
                    timeAgo: 'Az önce',
                };
                setComments(prev => [localFeedback, ...prev]);
                Alert.alert('Bilgi', 'Yorum yerel olarak kaydedildi (Supabase bağlantısı yok).');
            }
        } catch (error) {
            console.error('Yorum kaydetme hatası:', error);
            Alert.alert('Hata', 'Yorum kaydedilemedi.');
        } finally {
            setIsSaving(false);
            // Formu temizle ve modalı kapat
            setNewComment('');
            setMealName('');
            setSelectedCategory('GENEL');
            setShowAddModal(false);
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Öğrenci Geri Bildirimleri</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            {/* Sıralama filtresi */}
            <View style={styles.filterSection}>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setShowSortMenu(!showSortMenu)}
                >
                    <Text style={styles.sortLabel}>Sıralama: {currentSortLabel}</Text>
                    <Text style={styles.sortIcon}>▼</Text>
                </TouchableOpacity>

                {/* Sıralama menüsü */}
                {showSortMenu && (
                    <View style={styles.sortMenu}>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    styles.sortMenuItem,
                                    sortBy === option.key && styles.sortMenuItemActive
                                ]}
                                onPress={() => {
                                    setSortBy(option.key);
                                    setShowSortMenu(false);
                                }}
                            >
                                <Text style={[
                                    styles.sortMenuItemText,
                                    sortBy === option.key && styles.sortMenuItemTextActive
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Yorum kartları */}
                {comments.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}

                {/* Alt boşluk */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Yeni yorum ekleme butonu */}
            <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={() => setShowAddModal(true)}
            >
                <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>

            {/* Yorum Ekleme Modalı */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Yeni Yorum Ekle</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Kategori Seçimi */}
                        <Text style={styles.inputLabel}>Kategori</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScroll}
                        >
                            {categoryOptions.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === cat && styles.categoryChipActive
                                    ]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[
                                        styles.categoryChipText,
                                        selectedCategory === cat && styles.categoryChipTextActive
                                    ]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Yemek Adı */}
                        <Text style={styles.inputLabel}>Yemek Adı (Opsiyonel)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Örn: Mercimek Çorba"
                            placeholderTextColor={colors.textSecondary}
                            value={mealName}
                            onChangeText={setMealName}
                        />

                        {/* Yorum */}
                        <Text style={styles.inputLabel}>Yorumunuz *</Text>
                        <TextInput
                            style={[styles.textInput, styles.textAreaInput]}
                            placeholder="Düşüncelerinizi paylaşın..."
                            placeholderTextColor={colors.textSecondary}
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {/* Gönder Butonu */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleAddComment}
                        >
                            <Text style={styles.submitButtonText}>Yorumu Kaydet</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: colors.cardWhite,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: colors.textDark,
    },
    headerTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    searchButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: {
        fontSize: 20,
    },
    filterSection: {
        backgroundColor: colors.cardWhite,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        position: 'relative',
        zIndex: 10,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundLight,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
        gap: spacing.sm,
    },
    sortLabel: {
        fontSize: fontSize.md,
        color: colors.textDark,
        fontWeight: fontWeight.medium,
    },
    sortIcon: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    sortMenu: {
        position: 'absolute',
        top: 50,
        left: spacing.lg,
        backgroundColor: colors.cardWhite,
        borderRadius: borderRadius.lg,
        ...shadows.card,
        overflow: 'hidden',
        zIndex: 100,
    },
    sortMenuItem: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sortMenuItemActive: {
        backgroundColor: `${colors.primaryAccent}10`,
    },
    sortMenuItemText: {
        fontSize: fontSize.md,
        color: colors.textDark,
    },
    sortMenuItemTextActive: {
        color: colors.primaryAccent,
        fontWeight: fontWeight.semibold,
    },
    content: {
        flex: 1,
        paddingTop: spacing.md,
    },
    bottomSpacer: {
        height: 100,
    },
    addButton: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.card,
    },
    addIcon: {
        fontSize: 28,
        color: colors.textLight,
        fontWeight: fontWeight.bold,
    },
    // Modal Stilleri
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.cardWhite,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    modalTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    closeButton: {
        fontSize: 24,
        color: colors.textSecondary,
        padding: spacing.sm,
    },
    inputLabel: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    categoryScroll: {
        flexGrow: 0,
        marginBottom: spacing.sm,
    },
    categoryChip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundLight,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryChipActive: {
        backgroundColor: colors.primaryAccent,
        borderColor: colors.primaryAccent,
    },
    categoryChipText: {
        fontSize: fontSize.sm,
        color: colors.textDark,
        fontWeight: fontWeight.medium,
    },
    categoryChipTextActive: {
        color: colors.textLight,
    },
    textInput: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        fontSize: fontSize.md,
        color: colors.textDark,
        borderWidth: 1,
        borderColor: colors.border,
    },
    textAreaInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: colors.primaryDark,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    submitButtonText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
});
