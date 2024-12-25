import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Share,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import {
  Appbar,
  Searchbar,
  Card,
  Text,
  Button,
  Chip,
  Menu,
  Divider,
  IconButton,
  useTheme,
  Portal,
  Dialog,
  RadioButton,
  FAB,
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import dayjs from "dayjs";

import Swipeable from "react-native-gesture-handler/Swipeable";

// --------------
// SAMPLE DATA
// --------------
type FavoriteCategory = "Bible" | "Quote" | "Personal";

interface IFavorite {
  id: string;
  text: string;
  source: string;
  category: FavoriteCategory;
  dateAdded: string; // e.g. "2023-10-01T12:00:00Z"
}

const initialFavorites: IFavorite[] = [
  {
    id: "1",
    text: "For God so loved the world...",
    source: "John 3:16",
    category: "Bible",
    dateAdded: "2023-09-30T08:30:00Z",
  },
  {
    id: "2",
    text: "The best way to predict the future is to create it.",
    source: "Abraham Lincoln",
    category: "Quote",
    dateAdded: "2023-10-01T10:00:00Z",
  },
  {
    id: "3",
    text: "Personal reflection: Remember my blessings today.",
    source: "My Journal",
    category: "Personal",
    dateAdded: "2023-10-01T11:00:00Z",
  },
];

// For sorting
type SortOption = "Recent" | "A-Z" | "Category";
type GroupOption = "None" | "Category" | "Date";

// --------------
// MAIN COMPONENT
// --------------
export default function FavoritesScreen() {
  const theme = useTheme();

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Current filter tab
  const [filterTab, setFilterTab] = useState<FavoriteCategory | "All">("All");

  // Favorites data
  const [favorites, setFavorites] = useState<IFavorite[]>(initialFavorites);

  // Sorting & grouping
  const [sortOption, setSortOption] = useState<SortOption>("Recent");
  const [groupOption, setGroupOption] = useState<GroupOption>("None");

  // Menu for sort/group
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const menuAnchorRef = useRef<View>(null);

  // Dialog for picking sort/group
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<"sort" | "group">("sort");

  // -------------
  // HANDLERS
  // -------------
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Searching logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filtered data based on search + category filter
  const filteredData = favorites.filter((item) => {
    // Match category if filterTab != 'All'
    if (filterTab !== "All" && item.category !== filterTab) return false;
    // Match search query
    if (!item.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sorting
  const sortFavorites = (items: IFavorite[]): IFavorite[] => {
    const cloned = [...items];
    switch (sortOption) {
      case "Recent":
        // Sort by dateAdded descending
        return cloned.sort(
          (a, b) => dayjs(b.dateAdded).valueOf() - dayjs(a.dateAdded).valueOf()
        );
      case "A-Z":
        // Sort by text alphabetically
        return cloned.sort((a, b) => a.text.localeCompare(b.text));
      case "Category":
        // Sort by category name
        return cloned.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return cloned;
    }
  };

  const sortedData = sortFavorites(filteredData);

  // Grouping
  const groupedData = groupFavorites(sortedData, groupOption);

  function groupFavorites(data: IFavorite[], grouping: GroupOption) {
    if (grouping === "None") {
      return [{ key: "all", data }];
    } else if (grouping === "Category") {
      // Group by category
      const categories = Array.from(new Set(data.map((d) => d.category)));
      return categories.map((cat) => ({
        key: cat,
        data: data.filter((x) => x.category === cat),
      }));
    } else if (grouping === "Date") {
      // Group by date (yyyy-mm-dd)
      const dates = Array.from(
        new Set(data.map((d) => dayjs(d.dateAdded).format("YYYY-MM-DD")))
      );
      return dates.map((date) => ({
        key: date,
        data: data.filter(
          (x) => dayjs(x.dateAdded).format("YYYY-MM-DD") === date
        ),
      }));
    }
    return [{ key: "all", data }];
  }

  // Removing favorites (with animation)
  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  // Share
  const shareFavorite = async (item: IFavorite) => {
    try {
      await Share.share({
        title: "DailyManna Favorite",
        message: `${item.text} — ${item.source}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share this favorite.");
    }
  };

  // Edit category (or other tags)
  const editFavoriteCategory = (id: string) => {
    // For demonstration, just show an alert
    Alert.alert("Edit Category", `Open a dialog to edit item ${id}`);
  };

  // Long press
  const onLongPressItem = (item: IFavorite) => {
    Alert.alert(
      "Favorite Options",
      `You long-pressed: ${item.text}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Edit Category", onPress: () => editFavoriteCategory(item.id) },
      ],
      { cancelable: true }
    );
  };

  // -------------
  // TABS RENDER
  // -------------
  const categories: Array<FavoriteCategory | "All"> = [
    "All",
    "Bible",
    "Quote",
    "Personal",
  ];
  
  // -------------
  // RENDER
  // -------------
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Favorites" />

        {/* Instead of anchorRef, just inline the anchor as a node */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            leadingIcon="sort"
            onPress={() => {
              setDialogMode("sort");
              setDialogVisible(true);
              setMenuVisible(false);
            }}
            title="Sort"
          />
          <Menu.Item
            leadingIcon="arrange-send-backward"
            onPress={() => {
              setDialogMode("group");
              setDialogVisible(true);
              setMenuVisible(false);
            }}
            title="Group"
          />
        </Menu>
      </Appbar.Header>

      {/* DIALOG for picking sort or group */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>
            {dialogMode === "sort" ? "Sort Options" : "Group Options"}
          </Dialog.Title>
          <Dialog.Content>
            {dialogMode === "sort" ? (
              <RadioButton.Group
                value={sortOption}
                onValueChange={(val) => setSortOption(val as SortOption)}
              >
                <RadioButton.Item label="Recent" value="Recent" />
                <RadioButton.Item label="A-Z" value="A-Z" />
                <RadioButton.Item label="Category" value="Category" />
              </RadioButton.Group>
            ) : (
              <RadioButton.Group
                value={groupOption}
                onValueChange={(val) => setGroupOption(val as GroupOption)}
              >
                <RadioButton.Item label="None" value="None" />
                <RadioButton.Item label="Category" value="Category" />
                <RadioButton.Item label="Date" value="Date" />
              </RadioButton.Group>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search favorites..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* FILTER TABS */}
      <View style={styles.tabContainer}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            style={styles.tabChip}
            mode={filterTab === cat ? "flat" : "outlined"}
            onPress={() => setFilterTab(cat)}
          >
            {cat === "All" ? "All Favorites" : cat}
          </Chip>
        ))}
      </View>

      {/* FAVORITES LIST */}
      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={{ color: "#666" }}>
              No favorites found.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.groupSection}>
            {groupOption !== "None" && (
              <Text variant="titleSmall" style={styles.groupTitle}>
                {groupOption === "Category"
                  ? item.key
                  : dayjs(item.key).format("MMM DD, YYYY")}
              </Text>
            )}
            {item.data.map((fav) => (
              <Swipeable
                key={fav.id}
                overshootLeft={false}
                overshootRight={false}
                friction={2}
                renderRightActions={() => (
                  <View style={styles.swipeDeleteContainer}>
                    <Animatable.View
                      animation="fadeIn"
                      duration={300}
                      style={styles.deleteAction}
                    >
                      <IconButton
                        icon="delete-forever"
                        iconColor="#fff"
                        size={28}
                        onPress={() => removeFavorite(fav.id)}
                      />
                    </Animatable.View>
                  </View>
                )}
              >
                <Animatable.View
                  animation="fadeInUp"
                  duration={500}
                  style={{ marginBottom: 8 }}
                >
                  <Card
                    style={styles.favoriteCard}
                    onLongPress={() => onLongPressItem(fav)}
                  >
                    <Card.Content>
                      <Text variant="bodyLarge" style={styles.favoriteText}>
                        {fav.text}
                      </Text>
                      <View style={styles.rowSpace}>
                        <Text variant="labelSmall" style={styles.sourceText}>
                          {fav.source}
                        </Text>
                        <Text variant="labelSmall" style={styles.dateText}>
                          {dayjs(fav.dateAdded).format("MMM DD, YYYY")}
                        </Text>
                      </View>
                    </Card.Content>
                    <Card.Actions style={styles.cardActions}>
                      <Button
                        icon="share-variant"
                        onPress={() => shareFavorite(fav)}
                      >
                        Share
                      </Button>
                      <Button
                        icon="tag"
                        onPress={() => editFavoriteCategory(fav.id)}
                      >
                        Edit Tag
                      </Button>
                      <Button
                        icon="close-circle-outline"
                        onPress={() => removeFavorite(fav.id)}
                      >
                        Remove
                      </Button>
                    </Card.Actions>
                  </Card>
                </Animatable.View>
              </Swipeable>
            ))}
          </View>
        )}
      />

      {/* Extra FAB or actions if needed */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() =>
          Alert.alert(
            "Custom Collections",
            "Here you could create a new collection or something else."
          )
        }
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
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexWrap: "wrap",
  },
  tabChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  groupSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  groupTitle: {
    marginBottom: 6,
    fontWeight: "600",
    color: "#444",
  },
  favoriteCard: {
    borderRadius: 8,
  },
  favoriteText: {
    marginBottom: 6,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sourceText: {
    color: "#777",
  },
  dateText: {
    color: "#999",
  },
  cardActions: {
    justifyContent: "flex-end",
  },
  swipeDeleteContainer: {
    justifyContent: "center",
    marginVertical: 8,
  },
  deleteAction: {
    width: 60,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    borderRadius: 8,
    marginRight: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
