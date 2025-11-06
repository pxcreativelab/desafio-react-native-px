import { ToastType } from '@stores/useToastStore';
import styled, { DefaultTheme } from 'styled-components/native';

interface ContainerProps {
  type: ToastType;
}

const getBackgroundColor = (type: ToastType, theme: DefaultTheme) => {
  switch (type) {
    case 'success':
      return theme.colors.success;
    case 'error':
      return theme.colors.danger;
    case 'warning':
      return theme.colors.warning;
    case 'info':
      return theme.colors.info;
    default:
      return theme.colors.gray;
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
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  z-index: 9999;
`;

export const ToastItem = styled.View<ContainerProps>`
  background-color: ${({ type, theme }) => getBackgroundColor(type, theme)};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

export const IconContainer = styled.View`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const IconText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: bold;
`;

export const Message = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
  flex: 1;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export const CloseButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  font-weight: bold;
`;

export { getIcon };

