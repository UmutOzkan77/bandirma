import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Ana Sayfa' }} />
            <Stack.Screen name="(features)/yemekhane/index" options={{ title: 'Yemekhane' }} />
            <Stack.Screen name="(features)/sinav-takvimi/index" options={{ title: 'Sınav Takvimi' }} />
            <Stack.Screen name="(features)/etkinlikler/index" options={{ title: 'Etkinlikler' }} />
            <Stack.Screen name="(features)/devamsizlik/index" options={{ title: 'Devamsızlık' }} />
            <Stack.Screen name="(features)/ders-programi/index" options={{ title: 'Ders Programı' }} />
        </Stack>
    );
}
