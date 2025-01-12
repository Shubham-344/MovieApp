import { View, Text, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './App';
import { Show } from './HomeScreen';

const SearchScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to handle search and make API call
  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text === '') {
      setFilteredData([]); // Clear list when search bar is empty
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${text}`);
      const data = await response.json();
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Description card component
  const descriptionCard = ({ item }: { item: Show }) => {
    const imageUrl = item?.show?.image?.medium;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Details', { item })}>
        <View className="w-11/12 h-auto mx-auto mb-4 bg-[#88888866] flex flex-row" style={{ borderRadius: 10 }}>
          <View className="h-40 w-40 rounded-xl">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                resizeMode="stretch"
                className="h-full w-full rounded-xl elevation-xl"
              />
            ) : (
              <View className="w-full h-full bg-gray-400 rounded-xl flex justify-center items-center">
                <Image source={require('./assets/video.png')} className="h-16 w-16" />
              </View>
            )}
          </View>
          <View className="w-3/5 flex">
            <Text className="w-11/12 mx-auto text-xl font-bold mt-2">{item.show.name}</Text>
            {item.show.summary && <Text className="w-11/12 mx-auto text-sm font-normal my-2">
              {item.show.summary.replace(/<\/?p>/g, '').slice(0, 200)}...
            </Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="bg-zinc-500 flex-1">
      <View className="w-11/12 mb-5 h-[50px] mx-auto rounded-xl mt-12 bg-white" style={{ borderRadius: 12 }}>
        <Image source={require('./assets/search.png')} className="h-8 w-8 my-auto absolute right-4 top-3" />
        <TextInput
          placeholderTextColor="#555555"
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={handleSearch}
          className="w-12/12 my-auto ml-3 text-[#555555] text-lg font-bold"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" className="mt-5" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={descriptionCard}
          keyExtractor={(item) => item.show.id.toString()}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;