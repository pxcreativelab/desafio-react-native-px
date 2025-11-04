import { useCreateTicket } from '@hooks/tickets';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';

import TopLoadingBar from '@/components/TopLoadingBar';
import {
  Container,
  Content,
  ErrorText,
  FormGroup,
  Header,
  HeaderButton,
  HeaderButtonText,
  HeaderSpacer,
  HeaderTitle,
  Input,
  Label,
  // LoadingContainer and LoadingText removed — using inline submit spinner instead
  PickerButton,
  PickerButtonText,
  PickerContainer,
  SubmitButton,
  SubmitButtonText,
  TextArea,
} from './styles';


const CreateTicket = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('medium');
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { navigate, goBack } = useNavigation();
  const { mutate: createNewTicket, isPending } = useCreateTicket();

  const categories = ['Sistema', 'Bug', 'Feature Request', 'Dúvida', 'Outros'];
  const priorities = [
    { label: 'Baixa', value: 'low' },
    { label: 'Média', value: 'medium' },
    { label: 'Alta', value: 'high' },
    { label: 'Crítica', value: 'critical' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (title.length < 5) {
      newErrors.title = 'O título deve ter no mínimo 5 caracteres';
    }
    if (description.length < 10) {
      newErrors.description = 'A descrição deve ter no mínimo 10 caracteres';
    }
    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const ticketData = {
      title,
      description,
      category,
      priority,
    };

    createNewTicket(ticketData, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('Home');
        }, 1000);
      },
    });
  };
  const getPriorityLabel = (value: string) => {
    const priorityObj = priorities.find((p) => p.value === value);
    return priorityObj ? priorityObj.label : value;
  };

  // When creating a ticket, keep the page visible but disable inputs and
  // show a small spinner inside the submit button so the loading state
  // doesn't cover the entire UI.

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header>
          <HeaderButton onPress={goBack}>
            <HeaderButtonText>Cancelar</HeaderButtonText>
          </HeaderButton>
          <HeaderTitle>Novo Ticket</HeaderTitle>
          <HeaderSpacer />
        </Header>
        <TopLoadingBar visible={isPending} />

        <ScrollView keyboardShouldPersistTaps="handled">
          <Content>
            <FormGroup>
              <Label>Título *</Label>
              <Input
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title && text.length >= 5) {
                    setErrors((prev) => ({ ...prev, title: '' }));
                  }
                }}
                placeholder="Ex: Erro ao fazer login"
                maxLength={100}
                autoCapitalize="sentences"
              />
              {errors.title && <ErrorText>{errors.title}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Descrição *</Label>
              <TextArea
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description && text.length >= 10) {
                    setErrors((prev) => ({ ...prev, description: '' }));
                  }
                }}
                placeholder="Descreva o problema ou solicitação..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                autoCapitalize="sentences"
              />
              {errors.description && <ErrorText>{errors.description}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Categoria *</Label>
              <PickerContainer>
                <PickerButton onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
                  <PickerButtonText selected={!!category}>
                    {category || 'Selecione uma categoria'}
                  </PickerButtonText>
                </PickerButton>
              </PickerContainer>
              {showCategoryPicker && (
                <PickerContainer>
                  {categories.map((cat) => (
                    <PickerButton
                      key={cat}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                        if (errors.category) {
                          setErrors((prev) => ({ ...prev, category: '' }));
                        }
                      }}
                    >
                      <PickerButtonText>{cat}</PickerButtonText>
                    </PickerButton>
                  ))}
                </PickerContainer>
              )}
              {errors.category && <ErrorText>{errors.category}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Prioridade</Label>
              <PickerContainer>
                <PickerButton onPress={() => setShowPriorityPicker(!showPriorityPicker)}>
                  <PickerButtonText selected={true}>
                    {getPriorityLabel(priority)}
                  </PickerButtonText>
                </PickerButton>
              </PickerContainer>
              {showPriorityPicker && (
                <PickerContainer>
                  {priorities.map((p) => (
                    <PickerButton
                      key={p.value}
                      onPress={() => {
                        setPriority(p.value);
                        setShowPriorityPicker(false);
                      }}
                    >
                      <PickerButtonText>{p.label}</PickerButtonText>
                    </PickerButton>
                  ))}
                </PickerContainer>
              )}
            </FormGroup>

            <SubmitButton
              onPress={!isPending ? handleSubmit : undefined}
              disabled={isPending || !title || !description || !category}
              active={!!title && !!description && !!category && !isPending}
            >
              {isPending ? (
                <SubmitButtonText active={false}>
                  Criando...
                </SubmitButtonText>
              ) : (
                <SubmitButtonText active={!!title && !!description && !!category}>
                  Criar Ticket
                </SubmitButtonText>
              )}
            </SubmitButton>
          </Content>
        </ScrollView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default CreateTicket;
