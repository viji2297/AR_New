import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from './ThemedText';

const HEADER_HEIGHT = 120; 

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerName?: string;
  headerBackgroundColor: { dark: string; light: string };
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
}>;

export default function ParallaxScrollView({
  headerImage,
  headerName,
  headerBackgroundColor,
  children,
  headerComponent,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.5] // Smoother parallax effect
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [1.5, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          
          {headerImage && (
            <Animated.View style={styles.imageContainer}>
              {headerImage}
            </Animated.View>
          )}

{headerComponent ? (
            <View style={styles.fullHeaderContainer}>
              {headerComponent}
            </View>
          ) : (
            headerName && (
              <View style={styles.headerTitleContainer}>
                <ThemedText
                  type="title"
                  style={[
                    styles.headerTitle,
                    { color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                >
                  {headerName}
                </ThemedText>
              </View>
            )
          )}
          
        </Animated.View>

        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 16, 
    paddingBottom: 20, 
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 16,
    bottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    padding: 15,
    gap: 16,
    overflow: 'hidden',
  },
});
