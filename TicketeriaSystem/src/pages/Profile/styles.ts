import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

export const Header = styled.View`
  width: 100%;
  height: 64px;
  padding: 28px 16px 12px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e6e6ea;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const HeaderButtonText = styled.Text`
  color: #007aff;
  font-size: 16px;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

export const Content = styled.View`
  padding: 16px;
`;

export const Section = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const InfoLabel = styled.Text`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  color: #111;
  font-weight: 600;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #e6e6ea;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const SettingLabel = styled.Text`
  font-size: 14px;
  color: #111;
  font-weight: 500;
`;

export const LogoutButton = styled.TouchableOpacity`
  background-color: #d9534f;
  border-radius: 8px;
  padding: 14px;
  align-items: center;
  justify-content: center;
`;

export const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;
