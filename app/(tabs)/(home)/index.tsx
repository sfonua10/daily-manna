import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  // Dimensions,  // Removed since we don’t use width
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Button,
  FAB,
  Chip,
  useTheme,
} from 'react-native-paper';
import dayjs from 'dayjs';
import * as Animatable from 'react-native-animatable';

// -------------------
// Types / Interfaces
// -------------------
export interface IQuote {
  id: string;
  text: string;
  source: string;
  scheduledTime: string; // e.g. "08:00 AM"
  category: 'Bible' | 'Quote' | 'Personal';
}

// -------------------
// SAMPLE DATA
// -------------------
const INITIAL_QUOTES: IQuote[] = [
  {
    id: '1',
    text: 'For God so loved the world that He gave His one and only Son...',
    source: 'John 3:16',
    scheduledTime: '07:00 AM',
    category: 'Bible',
  },
  {
    id: '2',
    text: 'Do not be anxious about tomorrow, for tomorrow will be anxious for itself.',
    source: 'Matthew 6:34',
    scheduledTime: '12:00 PM',
    category: 'Bible',
  },
  {
    id: '3',
    text: 'The only limit to our realization of tomorrow is our doubts of today.',
    source: 'Franklin D. Roosevelt',
    scheduledTime: '05:00 PM',
    category: 'Quote',
  },
  {
    id: '4',
    text: 'Personal reflection: Remember to pray for guidance today.',
    source: 'My Journal',
    scheduledTime: '09:00 PM',
    category: 'Personal',
  },
];

export default function HomeScreen() {
  const theme = useTheme();

  // For pulling new data, etc.
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [quotes /*, setQuotes*/] = useState<IQuote[]>(INITIAL_QUOTES); 
  // ^ If you need to update `quotes`, uncomment the `setQuotes` above

  // For filtering categories
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // -------------
  // HANDLERS
  // -------------
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // In real app, you’d fetch updated quotes here
      setRefreshing(false);
    }, 1200);
  }, []);

  const toggleFavorite = (id: string) => {
    // Implement your "favorite" logic
    console.log(`Favorited quote with id: ${id}`);
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (selectedCategory === 'All') return true;
    return quote.category === selectedCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER with DailyManna Title & Current Date */}
      <Appbar.Header style={styles.appbar} statusBarHeight={0}>
        <Appbar.Content
          title="DailyManna"
          titleStyle={{ color: theme.colors.onPrimary }}
        />
        {/* Instead of subtitle, place a small Text manually */}
        <Text style={[styles.dateText, { color: theme.colors.onPrimary }]}>
          {dayjs().format('DD MMM, YYYY')}
        </Text>
      </Appbar.Header>

      <FlatList
        ListHeaderComponent={
          <View style={styles.topContainer}>
            {/* Verse of the Day Card (Animated) */}
            <Animatable.View
              animation="fadeInDown"
              duration={800}
              style={styles.verseOfDayCardContainer}
            >
              <Card style={styles.verseOfDayCard} elevation={2}>
                <Card.Content>
                  <Text variant="titleLarge" style={styles.verseTitle}>
                    Verse of the Day
                  </Text>
                  <Text variant="bodyMedium" style={styles.verseText}>
                    “I can do all things through Christ who strengthens me.”
                  </Text>
                  <Text variant="labelMedium" style={styles.verseReference}>
                    Philippians 4:13
                  </Text>
                </Card.Content>
              </Card>
            </Animatable.View>

            {/* Category Filter Chips */}
            <View style={styles.filterChipsContainer}>
              {['All', 'Bible', 'Quote', 'Personal'].map((category) => (
                <Chip
                  key={category}
                  // v5 doesn't support "contained"; use "flat" or "outlined"
                  mode={selectedCategory === category ? 'flat' : 'outlined'}
                  style={styles.chip}
                  onPress={() => setSelectedCategory(category)}
                >
                  {category}
                </Chip>
              ))}
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Today's Quotes
            </Text>
          </View>
        }
        data={filteredQuotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp" duration={800}>
            <Card style={styles.quoteCard} mode="elevated">
              <Card.Content>
                <Text variant="bodyLarge" style={{ marginBottom: 4 }}>
                  {item.text}
                </Text>
                <Text variant="labelSmall" style={styles.sourceText}>
                  {item.source}
                </Text>
                <Text variant="labelSmall" style={styles.timeText}>
                  Scheduled: {item.scheduledTime}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button
                  onPress={() => toggleFavorite(item.id)}
                  textColor={theme.colors.primary}
                >
                  Favorite
                </Button>
              </Card.Actions>
            </Card>
          </Animatable.View>
        )}
        // Pull-to-refresh:
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        // Some extra spacing at bottom
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button (Quick Access) */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Add new quote pressed')}
        label="Add Quote"
      />
    </SafeAreaView>
  );
}

// --------------
// STYLES
// --------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: 'red',
    borderWidth: 1,
  },
  appbar: {
    backgroundColor: '#4b0082',
    borderColor: 'green',
    borderWidth: 1,
    // If you want a smaller height:
    // height: 56,
  },
  dateText: {
    marginRight: 16,
    alignSelf: 'center',
  },
  topContainer: {
    padding: 16,
  },
  verseOfDayCardContainer: {
    marginBottom: 16,
  },
  verseOfDayCard: {
    borderRadius: 8,
    backgroundColor: '#fdf2ff',
  },
  verseTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  verseText: {
    marginBottom: 6,
    fontStyle: 'italic',
  },
  verseReference: {
    color: '#666',
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  quoteCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  sourceText: {
    color: '#777',
    marginBottom: 2,
  },
  timeText: {
    color: '#999',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
