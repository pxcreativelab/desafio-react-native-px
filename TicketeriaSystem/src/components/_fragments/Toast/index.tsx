import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { useToastStore } from '../../../stores/useToastStore';
import * as S from './styles';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToastStore();

  return (
    <S.Container>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </S.Container>
  );
};

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de saída antes de remover
    if (toast.duration && toast.duration > 0) {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onClose());
      }, toast.duration - 300);

      return () => clearTimeout(timeout);
    }
  }, [toast.duration, translateY, opacity, onClose]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}>
      <S.ToastItem type={toast.type}>
        <S.IconContainer>
          <S.IconText>{S.getIcon(toast.type)}</S.IconText>
        </S.IconContainer>
        <S.Message numberOfLines={2}>{toast.message}</S.Message>
        <S.CloseButton onPress={handleClose}>
          <S.CloseButtonText>×</S.CloseButtonText>
        </S.CloseButton>
      </S.ToastItem>
    </Animated.View>
  );
};
