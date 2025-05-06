import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

const initialBadges = [
  {
    id: '1',
    name: 'Pro Coder',
    icon_url: 'https://example.com/icon1.png',
    sort_order: 1,
  },
  {
    id: '2',
    name: 'Top Contributor',
    icon_url: 'https://example.com/icon2.png',
    sort_order: 2,
  },
  {
    id: '3',
    name: 'Bug Hunter',
    icon_url: 'https://example.com/icon3.png',
    sort_order: 3,
  },
];

export default function BadgeSorter() {
  const [badges, setBadges] = useState(initialBadges);

  const renderItem = ({ item, drag, isActive }) => (
    <View
      style={{
        flexDirection: 'row',
        padding: 16,
        backgroundColor: isActive ? '#e0f7fa' : '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
      }}
      onLongPress={drag}
    >
      <Image source={{ uri: item.icon_url }} style={{ width: 40, height: 40, marginRight: 10 }} />
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </View>
  );

  return (
    <DraggableFlatList
      data={badges}
      onDragEnd={({ data }) => {
        setBadges(data);

        // Prepare data to send to backend
        const updatedOrder = data.map((badge, index) => ({
          badge_id: badge.id,
          sort_order: index + 1,
        }));

        // Send to API
        fetch('https://yourapi.com/api/user/badges/order', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: 1001,
            badges: updatedOrder,
          }),
        });
      }}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}
