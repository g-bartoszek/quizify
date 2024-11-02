import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
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
        <Text style={styles.questionText}>Loading question...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <FlatList
        data={currentQuestion.answers}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, styles.additionalButtonSpacing]}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.buttonsContainer}
      />
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
  questionText: {
    fontSize: 24,
    marginTop: 40, // Added padding to move the question text down
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    width: '100%', // Ensure full width
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center', // Center text within the button
  },
  additionalButtonSpacing: {
    marginVertical: 10, // Added more space between answer buttons
  },
});