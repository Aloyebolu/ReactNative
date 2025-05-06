import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const NotificationItem = ({ id, message, onRemove }) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000, // Random duration between 5000 and 7000
      useNativeDriver: true,
    }).start(() => {
      onRemove(id); // Remove when animation finishes
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.notification,
        {
          transform: [{ translateX }],
          position: 'absolute',
          top: 0,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const NotificationStack = () => {
  const [notifications, setNotifications] = useState([]);
  let counter = useRef(1);

  const addNotification = () => {
    const id = Date.now();
    setNotifications((prev) => [
      ...prev,
      { id, message: `Notification ${counter.current++}` },
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Add Notification" onPress={addNotification} />
      <View style={styles.stack}>
        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            id={n.id}
            message={n.message}
            onRemove={removeNotification}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  stack: {
    // position: 'absolute',
    top: 100,
    height: 40,
    overflow: 'hidden',
    width: SCREEN_WIDTH,
    justifyContent: 'center',
  },
  notification: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
    fontSize: 14,
  },
});

export default NotificationStack;
