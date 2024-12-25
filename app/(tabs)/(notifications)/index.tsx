import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Switch,
  Card,
  Text,
  Button,
  IconButton,
  useTheme,
  TextInput,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import dayjs from 'dayjs';

/**
 * A simple interface for each time slot.
 */
interface ITimeSlot {
  id: number;
  time: string; // e.g. "08:00"
}

/**
 * A minimal Notifications screen for DailyManna.
 */
export default function NotificationsScreen() {
  const theme = useTheme();

  // Main toggle: Enable or disable notifications entirely.
  const [enabled, setEnabled] = useState<boolean>(false);

  // List of times the user has chosen.
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);

  // For a simple time input (in real app, you might use a TimePicker).
  const [newTime, setNewTime] = useState<string>('08:00');

  // Handler: Toggle notifications on/off
  const toggleNotifications = (value: boolean) => {
    setEnabled(value);
    if (!value) {
      // Optionally clear out times or keep them around, depending on your needs
      // setTimeSlots([]);
    }
  };

  // Handler: Add a new time slot
  const addTimeSlot = () => {
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
      Alert.alert('Invalid time format', 'Please use HH:MM format (e.g., 09:30).');
      return;
    }
    const slot: ITimeSlot = {
      id: Date.now(),
      time: newTime,
    };
    setTimeSlots((prev) => [...prev, slot]);
  };

  // Handler: Remove a time slot
  const removeTimeSlot = (id: number) => {
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <Text variant="headlineSmall" style={styles.header}>
          Notifications
        </Text>

        {/* MAIN TOGGLE */}
        <Card style={styles.toggleCard}>
          <Card.Title
            title="Enable Notifications"
            titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
            right={(props) => (
              <Switch
                {...props}
                value={enabled}
                onValueChange={toggleNotifications}
              />
            )}
          />
        </Card>

        {/* WHEN OFF, rest of the screen is disabled */}
        {/* We'll reduce opacity if disabled */}
        <View style={[styles.contentContainer, !enabled && { opacity: 0.4 }]}>
          {/* ADD TIME SECTION */}
          <Card style={styles.addTimeCard} elevation={1}>
            <Card.Title
              title="Add Notification Times"
              titleStyle={{ fontSize: 16 }}
            />
            <Card.Content style={styles.addTimeRow}>
              <TextInput
                label="HH:MM"
                value={newTime}
                mode="outlined"
                dense
                onChangeText={setNewTime}
                style={{ width: 100, marginRight: 8 }}
                disabled={!enabled}
                keyboardType="numeric"
              />
              <Button
                icon="plus"
                mode="contained"
                onPress={addTimeSlot}
                disabled={!enabled}
              >
                Add Time
              </Button>
            </Card.Content>
          </Card>

          {/* LIST OF TIME SLOTS */}
          {timeSlots.map((slot) => (
            <Animatable.View
              key={slot.id}
              animation="fadeInUp"
              duration={300}
              style={{ marginVertical: 4 }}
            >
              <Card style={styles.timeSlotCard}>
                <Card.Content style={styles.timeSlotRow}>
                  <Text style={{ fontSize: 16 }}>
                    {
                        dayjs(`2024-01-01 ${slot.time}`).format('h:mm A')
                    }
                  </Text>
                  <IconButton
                    icon="delete"
                    onPress={() => removeTimeSlot(slot.id)}
                    disabled={!enabled}
                  />
                </Card.Content>
              </Card>
            </Animatable.View>
          ))}

          {/* If no times, show a small note */}
          {timeSlots.length === 0 && (
            <Text style={styles.noTimesText}>
              No notifications scheduled yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  toggleCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
  },
  addTimeCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  addTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeSlotCard: {
    borderRadius: 8,
    paddingVertical: 2,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noTimesText: {
    marginTop: 8,
    color: '#777',
    textAlign: 'center',
  },
});
