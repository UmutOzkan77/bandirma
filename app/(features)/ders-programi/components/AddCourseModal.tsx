import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';
import type { SelectableOffering } from '../../../../lib/domain';

interface AddCourseModalProps {
    visible: boolean;
    onClose: () => void;
    onSearch: (query: string) => Promise<SelectableOffering[]>;
    onSave: (offering: SelectableOffering) => Promise<void> | void;
}

export default function AddCourseModal({ visible, onClose, onSearch, onSave }: AddCourseModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SelectableOffering[]>([]);
    const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!visible) {
            setQuery('');
            setResults([]);
            setSelectedOfferingId(null);
            return;
        }

        if (query.trim().length < 2) {
            setResults([]);
            setSelectedOfferingId(null);
            return;
        }

        const timer = setTimeout(() => {
            void (async () => {
                setIsSearching(true);
                const nextResults = await onSearch(query);
                setResults(nextResults);
                setSelectedOfferingId(nextResults[0]?.id ?? null);
                setIsSearching(false);
            })();
        }, 250);

        return () => clearTimeout(timer);
    }, [visible, query, onSearch]);

    const handleSave = async () => {
        const offering = results.find((item) => item.id === selectedOfferingId);
        if (!offering) {
            return;
        }

        setIsSaving(true);
        await onSave(offering);
        setIsSaving(false);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Iptal</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Buluttan Ders Ekle</Text>
                    <TouchableOpacity onPress={handleSave} disabled={!selectedOfferingId || isSaving}>
                        <Text style={[styles.saveText, (!selectedOfferingId || isSaving) && styles.saveTextDisabled]}>
                            {isSaving ? 'Kaydediliyor' : 'Kaydet'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Local override</Text>
                    <Text style={styles.infoText}>
                        Eklenen veya kaldirilan dersler sadece bu cihazdaki ders programi, sinav takvimi ve devamsizligi etkiler.
                    </Text>
                </View>

                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.input}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Ders kodu veya ders adi yazin"
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="characters"
                    />
                </View>

                <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
                    {isSearching ? (
                        <View style={styles.stateBox}>
                            <ActivityIndicator color={colors.accent} />
                            <Text style={styles.stateText}>Dersler araniyor...</Text>
                        </View>
                    ) : query.trim().length < 2 ? (
                        <View style={styles.stateBox}>
                            <Text style={styles.stateText}>Arama icin en az 2 karakter girin.</Text>
                        </View>
                    ) : results.length === 0 ? (
                        <View style={styles.stateBox}>
                            <Text style={styles.stateText}>Eslesen aktif ders acilisi bulunamadi.</Text>
                        </View>
                    ) : (
                        results.map((offering) => {
                            const selected = selectedOfferingId === offering.id;
                            return (
                                <TouchableOpacity
                                    key={offering.id}
                                    style={[styles.resultCard, selected && styles.resultCardSelected]}
                                    onPress={() => setSelectedOfferingId(offering.id)}
                                >
                                    <View style={styles.resultHeader}>
                                        <Text style={styles.resultCode}>{offering.course.courseCode}</Text>
                                        <Text style={styles.resultSection}>
                                            Sinif {offering.classLevel}
                                            {offering.section ? ` • Sube ${offering.section}` : ''}
                                        </Text>
                                    </View>
                                    <Text style={styles.resultTitle}>{offering.course.courseName}</Text>
                                    <Text style={styles.resultMeta}>
                                        {offering.instructorName ?? 'Ogretim gorevlisi'}
                                        {offering.scheduleSlots[0]?.room ? ` • ${offering.scheduleSlots[0].room}` : ''}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.lg,
    },
    cancelText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    saveText: {
        fontSize: fontSize.md,
        color: colors.accent,
        fontWeight: fontWeight.bold,
    },
    saveTextDisabled: {
        opacity: 0.4,
    },
    infoCard: {
        marginHorizontal: spacing.xl,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        backgroundColor: '#EFF6FF',
    },
    infoTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    infoText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    searchBox: {
        marginHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    input: {
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.cardBackground,
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
    results: {
        flex: 1,
    },
    resultsContent: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    stateBox: {
        paddingVertical: spacing.xxl,
        alignItems: 'center',
        gap: spacing.md,
    },
    stateText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    resultCard: {
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        backgroundColor: colors.cardBackground,
        marginBottom: spacing.md,
        ...shadows.card,
    },
    resultCardSelected: {
        borderColor: colors.primary,
        backgroundColor: '#EFF6FF',
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    resultCode: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.accent,
    },
    resultSection: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    resultTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    resultMeta: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
});
