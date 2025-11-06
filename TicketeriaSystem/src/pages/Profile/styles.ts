import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
`;

export const Header = styled.View`
  width: 100%;
  height: 64px;
  padding: 28px ${({ theme }) => theme.spacing.md}px 12px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const HeaderButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const Section = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const InfoLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

export const InfoValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const SettingLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

export const LogoutButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: 14px;
  align-items: center;
  justify-content: center;
  flex: 2;
`;

export const LogoutButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 700;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const BackButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.white};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: 14px;
  align-items: center;
  justify-content: center;
  flex: 3;
`;

export const BackButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 700;
`;
