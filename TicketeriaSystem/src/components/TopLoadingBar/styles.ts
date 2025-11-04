import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  height: 5px;
  width: 100%;
  background-color: transparent;
  overflow: hidden;
  position: relative;
`;

export const AnimatedContainer = styled(Animated.View)`
  height: 5px;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const Bar = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #007aff;
  width: 100%;
  border-radius: 20px;
`;

export const AnimatedBarWrapper = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  
`;
