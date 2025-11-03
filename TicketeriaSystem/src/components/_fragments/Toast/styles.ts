import styled from 'styled-components/native';
import { ToastType } from '../../stores/useToastStore';

interface ContainerProps {
  type: ToastType;
}

const getBackgroundColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '#34C759';
    case 'error':
      return '#FF3B30';
    case 'warning':
      return '#FF9500';
    case 'info':
      return '#007AFF';
    default:
      return '#8E8E93';
  }
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return '•';
  }
};

export const Container = styled.View`
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
  z-index: 9999;
`;

export const ToastItem = styled.View<ContainerProps>`
  background-color: ${props => getBackgroundColor(props.type)};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

export const IconContainer = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const IconText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
`;

export const Message = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 8px;
`;

export const CloseButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

export { getIcon };

