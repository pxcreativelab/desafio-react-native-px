import React from 'react';
import {
  ButtonRow,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  ModalContainer,
  ModalMessage,
  ModalTitle,
  Overlay,
  Spacer,
} from './styles';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <Overlay pointerEvents="box-none">
      <Spacer activeOpacity={1} onPress={onCancel} />
      <ModalContainer>
        {title ? <ModalTitle>{title}</ModalTitle> : null}
        {message ? <ModalMessage>{message}</ModalMessage> : null}
        <ButtonRow>
          <CancelButton onPress={onCancel}>
            <CancelButtonText>{cancelLabel}</CancelButtonText>
          </CancelButton>
          <ConfirmButton onPress={onConfirm}>
            <ConfirmButtonText>{confirmLabel}</ConfirmButtonText>
          </ConfirmButton>
        </ButtonRow>
      </ModalContainer>
      <Spacer activeOpacity={1} onPress={onCancel} />
    </Overlay>
  );
};

export default ConfirmModal;
