import React from 'react';
import { Comment } from '../../../services/TicketApi';
import { CommentText, Container, DateText, Header, UserName } from './styles';

interface TicketCommentProps {
  comment: Comment;
}

const TicketComment: React.FC<TicketCommentProps> = ({ comment }) => {
  return (
    <Container>
      <Header>
        <UserName>{comment.createdBy.name}</UserName>
        <DateText>
          {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às{' '}
          {new Date(comment.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </DateText>
      </Header>
      <CommentText>{comment.text}</CommentText>
    </Container>
  );
};

export default TicketComment;
