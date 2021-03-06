import React, { useState, useEffect } from 'react';
import validations from './validations';
import * as api from '../../services/auth';
import { useAuth } from '../../contexts/auth';
import { Alert } from 'react-native';
import { AppName } from '../../constants';

import {
  Container,
  InputsContainer,
  BottomContainer,
  TextBottom,
  TextBottomButton,
  LoginRegisterLink,
  TextBottomContainer,
  HeaderContainer
} from './styles';

import Input from '../../components/Input';
import Header from '../../components/Header';
import Button from '../../components/Button';

const initialUserData = {
  name: '',
  email: 'guisilva.dev@gmail.com',
  password: '827554',
  confirmPassword: '',
  firstName: '1',
  lastName: '2',
}

const SignIn = (props) => {

  //variaveis de contexto
  const { signIn } = useAuth();

  //variaveis de estado
  const [userData, setUserData] = useState(initialUserData);
  const [stageNew, setStageNew] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignInOrRegister = async () => {

    setLoading(true);
    //IF stageNew == REGISTER
    if (stageNew) {
      try {
        const response = await api.register(userData);
        setLoading(false);
        Alert.alert(
          'Registration Successful.',
          response.message,
          [{ text: 'OK', onPress: () => setStageNew(false) }],
          { cancelable: false },
        );
      } catch (error) {
        Alert.alert(error.message);
        setLoading(false);
        //setError(error.message);
      }

    } else { //ELSE SE NAO FOR REGISTOR EH LOGIN
      try {
        const response = await api.login(userData);
        await signIn(response);

        //nao eh necessario aqui trocar loading para false pois o componente
        //sera desmontado
        //setLoading(false);

      } catch (error) {
        Alert.alert(error.message);
        setLoading(false);
        //setError(error.message);
      }

    }
  }

  //listener que verifica se os forms atendem as validacoes
  useEffect(() => {
    setValidForm(validations(userData));
  }, [userData]);

  return (
    <Container>
      <HeaderContainer>
        <Header title={AppName} />
      </HeaderContainer>

      <InputsContainer>

        {stageNew &&
          <Input placeholder="Name" iconName="user" onChangeText={
            (text) => setUserData({ ...userData, name: text, firstName: text, lastName: text })}
            value={userData.name}
          />}

        <Input placeholder="Email" iconName="mail" onChangeText={
          (text) => setUserData({ ...userData, email: text })}
          size={!stageNew && 'big'} value={userData.email} />

        <Input placeholder="Password" iconName="lock" secure={true}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          style={{ marginTop: stageNew ? 0 : 20 }} size={!stageNew && 'big'}
          value={userData.password} />

        {stageNew && <Input placeholder="Confirm Password" iconName="key"
          secure={true}
          onChangeText={(text) => setUserData({ ...userData, confirmPassword: text })}
          value={userData.confirmPassword} />}

      </InputsContainer>

      <BottomContainer>
        <Button title={stageNew ? 'Register' : 'Login'} loading={loading}
          onPress={handleSignInOrRegister} disabled={!validForm}
        />
        <TextBottomContainer>
          <TextBottom>{stageNew ? "Already have an account?" : "Don't have an account yet? "} </TextBottom>
          <LoginRegisterLink onPress={() => setStageNew(!stageNew)}>
            <TextBottomButton>{stageNew ? "Login Here" : "Register Here"}</TextBottomButton>
          </LoginRegisterLink>
        </TextBottomContainer>
      </BottomContainer>

    </Container>
  );
};


export default SignIn;
//export default connect(null, mapDispatchToProps)(SignIn);