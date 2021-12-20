import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CarouselItem from "../carouselItem";

const { width } = Dimensions.get("window");

const _viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

function Carousel({ data }) {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  const [dataList, setDataList] = useState(data);
  const [list, setList] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [backDisabled, setBackDisabled] = useState(true);

  const handleNext = () => {
    setScrollValue(Math.round(scrollValue + width));
    setButtonIndex(buttonIndex + 1);
  };

  const handleBack = () => {
    setScrollValue(Math.round(scrollValue - width));
    setButtonIndex(buttonIndex - 1);
  };

  const nextScroll = () => {
    const numberOfData = dataList.length - 1;
    const actualIndex = currentIndex;
    if (actualIndex < numberOfData) {
      handleNext();
      list.scrollToOffset({ animated: true, offset: scrollValue + width });
    }
  };

  const backScroll = () => {
    handleBack();
    list.scrollToOffset({ animated: true, offset: scrollValue - width });
  };

  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  }, []);

  useEffect(() => {
    const actualIndex = currentIndex;
    const roundWidth = Math.round(width);
    const scrollParam = roundWidth * actualIndex;
    if (scrollValue !== scrollParam) {
      if (scrollValue > scrollParam) {
        handleBack();
      } else {
        handleNext();
      }
    }
    if (actualIndex !== 0) {
      setBackDisabled(false);
      if (actualIndex !== dataList.length - 1) {
        setNextDisabled(false);
      }
    } else {
      setBackDisabled(true);
      setNextDisabled(false);
    }
    if (actualIndex === dataList.length - 1) {
      setNextDisabled(true);
    }

    setDataList(data);
  }, [currentIndex, scrollValue]);

  if (data && data.length) {
    return (
      <SafeAreaView>
        <View>
          <FlatList
            data={data}
            ref={(flatList) => {
              setList(flatList);
            }}
            keyExtractor={(item, index) => "key" + index}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            onScroll={onScroll}
            scrollEventThrottle={16}
            decelerationRate={"fast"}
            viewabilityConfig={_viewabilityConfig}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return <CarouselItem item={item} />;
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
                listener: (e) => {
                  onScroll(e);
                },
              }
            )}
          />

          <View style={styles.dotView}>
            {data.map((_, i) => {
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={i}
                  style={{
                    opacity,
                    height: 10,
                    width: 10,
                    backgroundColor: "#595959",
                    margin: 8,
                    borderRadius: 5,
                  }}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.buttonView}>
          <Button disabled={backDisabled} onPress={backScroll} title="Back" />
          <Button disabled={nextDisabled} onPress={nextScroll} title="Next" />
        </View>
      </SafeAreaView>
    );
  }

  console.log("Please provide Images");
  return null;
}

const styles = StyleSheet.create({
  dotView: { flexDirection: "row", justifyContent: "center" },
  buttonView: { flexDirection: "row", justifyContent: "space-around" },
});

export default Carousel;
