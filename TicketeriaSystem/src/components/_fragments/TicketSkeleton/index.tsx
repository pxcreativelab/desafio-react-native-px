import React from 'react';
import styled from 'styled-components/native';

const SkeletonContainer = styled.View`
  padding: 16px;
  gap: 16px;
`;

const SkeletonCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
`;

const SkeletonLine = styled.View<{ width?: string; height?: string }>`
  background-color: #E1E9EE;
  border-radius: 4px;
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  opacity: 0.7;
`;

const SkeletonHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SkeletonFooter = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
`;

export const TicketSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
      {[1, 2, 3, 4, 5].map((item) => (
        <SkeletonCard key={item}>
          <SkeletonHeader>
            <SkeletonLine width="60%" height="20px" />
            <SkeletonLine width="80px" height="24px" />
          </SkeletonHeader>
          <SkeletonLine width="100%" height="14px" />
          <SkeletonLine width="85%" height="14px" />
          <SkeletonFooter>
            <SkeletonLine width="70px" height="20px" />
            <SkeletonLine width="70px" height="20px" />
            <SkeletonLine width="90px" height="20px" />
          </SkeletonFooter>
        </SkeletonCard>
      ))}
    </SkeletonContainer>
  );
};
