import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent } from 'react-native';
import { AnimatedBarWrapper, AnimatedContainer, Bar } from './styles';

type Props = {
  visible?: boolean;
  backgroundColor?: string;
};

const TopLoadingBar: React.FC<Props> = ({ visible = false, backgroundColor }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState<boolean>(visible);

  useEffect(() => {
    // Show
    if (visible) {
      setMounted(true);
      // fade in
      Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => {
        // start sliding loop when we have a width
        if (width > 0) {
          progress.setValue(0);
          // animate forward then backward (ping-pong) for a smoother effect
          loopRef.current = Animated.loop(
            Animated.sequence([
              Animated.timing(progress, {
                toValue: 1,
                duration: 900,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(progress, {
                toValue: 0,
                duration: 900,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
            ])
          );
          loopRef.current.start();
        }
      });
      return;
    }

    // Hide
    if (!visible) {
      // stop loop
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
      Animated.timing(opacity, { toValue: 0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => {
        progress.setValue(0);
        setMounted(false);
      });
    }
  }, [visible, width, opacity, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.4, width],
  });

  const barWidth = Math.max(24, width * 0.35);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  if (!mounted) return null;

  return (
    <AnimatedContainer onLayout={onLayout} style={{ opacity }}>
      {width > 0 && (
        <AnimatedBarWrapper style={{ width: barWidth, transform: [{ translateX }] }}>
          <Bar style={backgroundColor ? { backgroundColor } : undefined} />
        </AnimatedBarWrapper>
      )}
    </AnimatedContainer>
  );
};

export default TopLoadingBar;
