import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  Snackbar,
  ActivityIndicator,
  HelperText,
  RadioButton,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';

const MAX_CHARACTERS = 300;
type QuoteCategory = 'Bible' | 'Quote' | 'Personal';

export default function AddQuoteScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [quoteText, setQuoteText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState<QuoteCategory>('Bible');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!quoteText.trim()) {
      setErrorMessage('Please enter a quote or verse text.');
      return;
    }
    if (quoteText.length > MAX_CHARACTERS) {
      setErrorMessage(`Exceeds ${MAX_CHARACTERS} characters`);
      return;
    }
    setLoading(true);
    try {
      const newQuote = {
        id: Date.now().toString(),
        text: quoteText.trim(),
        source: source.trim(),
        category,
        dateSaved: dayjs().toISOString(),
      };
      const existingQuotesStr = await AsyncStorage.getItem('DAILYM_QUOTE_LIST');
      let existingQuotes = existingQuotesStr ? JSON.parse(existingQuotesStr) : [];
      existingQuotes.push(newQuote);
      await AsyncStorage.setItem('DAILYM_QUOTE_LIST', JSON.stringify(existingQuotes));

      setSuccessMessage('Quote saved!');
      setQuoteText('');
      setSource('');
      setCategory('Bible');
      setTimeout(() => {
        router.back(); // navigate back
      }, 1000);
    } catch (error) {
      setErrorMessage('Failed to save quote. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuoteText('');
    setSource('');
    setCategory('Bible');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {errorMessage && (
        <Snackbar
          visible
          onDismiss={() => setErrorMessage(null)}
          duration={3000}
        >
          {errorMessage}
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar
          visible
          onDismiss={() => setSuccessMessage(null)}
          duration={3000}
        >
          {successMessage}
        </Snackbar>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Quote / Verse"
          value={quoteText}
          onChangeText={setQuoteText}
          mode="outlined"
          multiline
          style={{ marginBottom: 8, minHeight: 80 }}
        />
        <HelperText
          type={quoteText.length > MAX_CHARACTERS ? 'error' : 'info'}
        >
          {`${quoteText.length}/${MAX_CHARACTERS} characters`}
        </HelperText>

        <TextInput
          label="Source/Reference (optional)"
          value={source}
          onChangeText={setSource}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />

        <Text variant="labelLarge" style={{ marginBottom: 4 }}>
          Category:
        </Text>
        <RadioButton.Group
          value={category}
          onValueChange={(val) => setCategory(val as QuoteCategory)}
        >
          <View style={styles.radioRow}>
            <RadioButton value="Bible" />
            <Text>Bible Verse</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Quote" />
            <Text>Quote</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Personal" />
            <Text>Personal Note</Text>
          </View>
        </RadioButton.Group>

        <Card style={{ marginTop: 20, marginBottom: 16 }}>
          <Card.Title title="Preview" subtitle="See how it looks" />
          <Card.Content>
            <Text variant="bodyLarge" style={{ marginBottom: 6 }}>
              {quoteText.trim() || 'Enter text above...'}
            </Text>
            {source.trim() && (
              <Text variant="labelSmall" style={{ color: '#666' }}>
                {source}
              </Text>
            )}
          </Card.Content>
        </Card>

        <View style={styles.buttonsRow}>
          <Button
            mode="outlined"
            icon="delete"
            onPress={handleClear}
            style={{ marginRight: 8 }}
          >
            Clear
          </Button>
          <Button
            mode="contained"
            icon="content-save"
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </View>

        {loading && (
          <ActivityIndicator
            animating
            size="large"
            style={{ marginTop: 16 }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'flex-end',
  },
});
