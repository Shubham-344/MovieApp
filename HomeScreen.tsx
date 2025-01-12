import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import './global.css';
import { useNavigation} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './App';
export interface Show {
    score: number;
    show: {
      id: number;
      url: string;
      name: string;
      type: string;
      language: string;
      genres: string[];
      status: string;
      runtime: number;
      averageRuntime: number;
      premiered: string;
      ended: string | null;
      officialSite: string;
      schedule: {
        time: string;
        days: string[];
      };
      rating: {
        average: number;
      };
      weight: number;
      network: {
        id: number;
        name: string;
        country: {
          name: string;
          code: string;
          timezone: string;
        };
        officialSite: string;
      };
      webChannel: string | null;
      dvdCountry: string | null;
      externals: {
        tvrage: string | null;
        thetvdb: number;
        imdb: string;
      };
      image: {
        medium: string;
        original: string;
      };
      summary: string;
      updated: number;
      _links: {
        self: {
          href: string;
        };
        previousepisode: {
          href: string;
          name: string;
        };
        nextepisode: {
          href: string;
          name: string;
        };
      };
    };
  }
export type ApiResponse = Show[];
const HomeScreen = () => {
    const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [movieData,setMovieData] = useState<ApiResponse>([]);
  useEffect(()=>{
    const apiUrl = 'https://api.tvmaze.com/search/shows?q=all';
    fetch(apiUrl)
      .then((response) => response.json())  // Convert response to JSON
      .then((data) => {
        // Log the data to the console
        console.log('API Data:', data);
        setMovieData(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error fetching data:', error);
      }); 
  },[]);

  const truncateDescription = (description: string, limit: number) => {
    const words = description.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...'; // Add '...' at the end
    }
    return description; // Return the full description if it's under the word limit
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(<\/?b>)/); // Split by <b> and </b> tags
  
    return parts.map((part, index) => {
      if (part === '<b>' || part === '</b>') {
        return null; // Skip the tags themselves
      }
  
      // Check if the part is between <b> and </b> tags
      const isBold = parts[index - 1] === '<b>' && parts[index + 1] === '</b>';
  
      return (
        <Text key={index} style={{ fontWeight: isBold ? 'bold' : 'normal' }}>
          {part}
        </Text>
      );
    });
  };

  const descriptionCard = ({item} : {item : any}) => {
    const imageUrl = item?.show?.image?.medium;
    
    const truncatedSummary = truncateDescription(item?.show?.summary.replace(/<\/?p>/g, ""), 150); // Clean and truncate
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Details', { item })} activeOpacity={0.8} className='w-11/12 h-52 mx-auto mb-4 bg-[#88888866] flex flex-row items-center' style={{borderRadius:10}}>
            {imageUrl ?
                <Image source={{ uri: imageUrl }} resizeMode='stretch'  className="h-full w-2/5 rounded-xl elevation-xl" />
            :
                <View className='w-2/5 h-full bg-gray-400 rounded-xl flex justify-center items-center'>
                    <Image source={require('./assets/video.png')} className='h-16 w-16'/>
                </View>
            }
            <View className='w-3/5 flex'>
                <Text className='w-11/12 mx-auto text-xl font-bold mt-2 text-wrap'>{item.show.name}</Text>
                <Text className='w-11/12 h-36 mx-auto text-sm font-normal my-2 text-wrap'>{renderFormattedText(truncatedSummary)}</Text>
            </View>
        </TouchableOpacity>
    );
  };
  const renderItem = ({ item, index }: { item: Show; index: number }) => {
    const imageUrl = item?.show?.image?.medium;
    return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Details', { item })} className='flex my-4 mx-2'>
      <View className='h-40 w-40 rounded-xl '>
        {imageUrl
        ?
        <Image source={{ uri: imageUrl }} resizeMode='stretch'  className="h-full w-full rounded-xl elevation-xl" />
        :
        <View className='w-full h-full bg-gray-400 rounded-xl flex justify-center items-center'>
                    <Image source={require('./assets/video.png')} className='h-16 w-16'/>
        </View>
        }
      </View>
      <Image source={require('./assets/bookmark.png')} className='absolute h-16 w-12 -top-[9px] left-3'/>
      <Text className='text-3xl font-black text-gray-300 absolute left-6'>{index +2}</Text>
      <Text className='mx-auto text-lg font-extrabold text-black'>{item.show.name}</Text>
    </TouchableOpacity>
    );
  };
  return (

    <SafeAreaView className='flex bg-zinc-500 flex-1'>
        <ScrollView>
        <Text className='text-2xl text-white font-black m-4'>Top Chart</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Details', { item: movieData[0] })} className='bg-white h-[450px] w-11/12 mx-auto rounded-xl mb-4'>
            <Image source={{ uri: movieData[0]?.show.image.original }} resizeMode='stretch'  className="h-full w-full rounded-xl elevation-xl" />
            <Image source={require('./assets/bookmark.png')} className='absolute h-16 w-12 -top-[10px] left-3'/>
            <Text className='text-3xl font-black text-gray-300 absolute left-6'>1</Text>
        </TouchableOpacity>
        <FlatList
        className='mx-4'
        horizontal
        data={movieData.slice(1, 5)} // Slice to show only index 1 to 4
        renderItem={renderItem}
        keyExtractor={(item) => item.show.id.toString()}
        />
        <FlatList
        data={movieData} // This is your movie data
        renderItem={descriptionCard} // This renders each card
        keyExtractor={(item) => item.show.id.toString()} // Unique key for each item, could be `id` or `name`
    />
    </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
