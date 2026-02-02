import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bandırma Üniversitesi</Text>
            <View style={styles.linkContainer}>
                <Link href="/(features)/yemekhane" style={styles.link}>Yemekhane</Link>
                <Link href="/(features)/sinav-takvimi" style={styles.link}>Sınav Takvimi</Link>
                <Link href="/(features)/etkinlikler" style={styles.link}>Etkinlikler</Link>
                <Link href="/(features)/devamsizlik" style={styles.link}>Devamsızlık</Link>
                <Link href="/(features)/ders-programi" style={styles.link}>Ders Programı</Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    linkContainer: {
        gap: 15,
    },
    link: {
        fontSize: 18,
        color: 'blue',
        padding: 10,
    },
});
