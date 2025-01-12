import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RouteProp } from '@react-navigation/native';
import { Show } from './HomeScreen';
import LinearGradient from 'react-native-linear-gradient';


type DetailsRouteProp = RouteProp<{ params: { item: any } }, 'params'>;

const Details = ({ route }: { route: DetailsRouteProp }) => {
    const {item} = route.params;
    const [data,setData] = useState<Show>();
    const [rating,setRating] = useState<number>();
    useEffect(()=>{
        setData(item);
        setRating(data?.show.rating.average);
    },[item,data]);
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
      const truncatedSummary = truncateDescription(item?.show?.summary.replace(/<\/?p>/g, ""), 150); // Clean and truncate

      const openLink = () => {
        const url = data?.show.url;
        if (url) {
            Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
        } else {
            console.error('URL is undefined');
        }
      };
      const imageUrl = data?.show?.image?.original;
  return (

    <SafeAreaView className='flex-1 flex bg-zinc-500'>
        <ScrollView>
        {rating && <Text className='bg-yellow-500 w-20 h-10 rounded-t-lg rounded-bl-lg absolute z-10 elevation-2xl left-4 top-4 text-2xl align-middle text-center font-bold '>{rating}/10</Text>}
        <View className='w-full h-[500px]'>
        <View className='h-[500px] w-full'>
        {imageUrl
        ?
        <Image source={{ uri: imageUrl }} resizeMode='stretch'  className="h-full w-full" />
        :
        <View className='w-full h-full bg-gray-400 rounded-xl flex justify-center items-center'>
                    <Image source={require('./assets/video.png')} className='h-16 w-16'/>
        </View>
        }
      </View>
        <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(113, 113, 122, 1)']}
        style={{position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,}}
      />
        </View>
        <TouchableOpacity onPress={openLink} activeOpacity={1} className='w-full h-16  rounded-md px-10 gap-3 mx-auto justify-center flex flex-row mt-5'>
            <View className='w-80 h-full rounded-md bg-white flex flex-row justify-center items-center gap-2'>
                <Text className='text-2xl font-black text-zinc-500 my-auto '>Watch Now</Text>
                <Image source={require('./assets/play.png')} className='h-6 w-6 my-auto'/>
            </View>
            <View className='w-16 h-full rounded-md bg-white flex justify-center items-center'>
                <Image source={require('./assets/download.png')} className='h-7 w-7 my-auto'/>
            </View>
        </TouchableOpacity>
        <Text className='text-2xl font-extrabold text-white ml-5 mt-3'>Summary</Text>
        <Text className='text-white text-lg text-justify px-5 '>
            {renderFormattedText(truncatedSummary)}
        </Text>
        <View className='h-12 w-9/12 border-b-[1px] border-gray-300 flex flex-row mx-auto'>
            <Text className='w-1/2 h-full text-start text-white font-bold text-xl align-middle'>Duration</Text>
            <Text className='w-1/2 h-full text-right text-white font-bold text-xl align-middle'>{data?.show.runtime} minutes</Text>
        </View>
        <View className='h-12 w-9/12 border-b-[1px] border-gray-300 flex flex-row mx-auto'>
            <Text className='w-1/2 h-full text-start text-white font-bold text-xl align-middle'>Languages</Text>
            <Text className='w-1/2 h-full text-right text-white font-bold text-xl align-middle'>{data?.show.language}</Text>
        </View>
        <View className='h-12 w-9/12 border-b-[1px] border-gray-300 flex flex-row mx-auto'>
            <Text className='w-1/3 h-full text-start text-white font-bold text-xl align-middle'>Geners</Text>
            <Text className='w-2/3 h-full text-right text-white font-bold text-xl align-middle'>{data?.show.genres} </Text>
        </View>
        <View className='h-12 w-9/12 border-b-[1px] border-gray-300 flex flex-row mx-auto'>
            <Text className='w-1/2 h-full text-start text-white font-bold text-xl align-middle'>Premiered</Text>
            <Text className='w-1/2 h-full text-right text-white font-bold text-xl align-middle'>{data?.show.premiered} </Text>
        </View>
        <View className='h-12 w-9/12 border-b-[1px] border-gray-300 flex flex-row mx-auto'>
            <Text className='w-1/2 h-full text-start text-white font-bold text-xl align-middle'>Type</Text>
            <Text className='w-1/2 h-full text-right text-white font-bold text-xl align-middle'>{data?.show.type} </Text>
        </View>
        
        </ScrollView>
    </SafeAreaView>
  );
};

export default Details;
