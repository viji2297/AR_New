import { Card, Text } from 'react-native-paper';
import type { PropsWithChildren } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';

type Props = PropsWithChildren<{ title: string, work: string }>;

export default function TextCardContent({ title, work }: Props) {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <>
                <Card style={[styles.card, colorScheme === 'dark' ? styles.darkCard : styles.lightCard]}>
                    <ThemedView style={[styles.view, colorScheme === 'dark' ? styles.darkView : styles.lightView]}>
                        <Card.Content>
                            <Text variant="titleLarge">{title}</Text>
                            <Text variant="bodyMedium">Work - {work}</Text>
                        </Card.Content>
                    </ThemedView>
                </Card>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginVertical: 8,
    },
    view: {
        padding: 6,
        borderRadius: 8,
    },
    darkCard: {
        backgroundColor: '#333',
    },
    lightCard: {
        backgroundColor: '#fff',
    },
    darkView: {
        backgroundColor: '#F6FFEE',
    },
    lightView: {
        backgroundColor: '#FAD2CC',
    }
});