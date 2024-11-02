import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import questionsData from './assets/questions.json';

type Question = {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
};

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const pickRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionsData.length);
    setCurrentQuestion(questionsData[randomIndex]);
  };

  useEffect(() => {
    pickRandomQuestion();
  }, []);

  const handleAnswer = (index: number) => {
    if (index === currentQuestion?.correct) {
      Alert.alert('Correct!', 'You answered correctly.');
    } else {
      Alert.alert('Wrong', `Incorrect. ${currentQuestion?.explanation}`);
    }
    pickRandomQuestion();
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>Loading question...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{currentQuestion.question}</Text>
      {currentQuestion.answers.map((answer, index) => (
        <Button key={index} title={answer} onPress={() => handleAnswer(index)} />
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

