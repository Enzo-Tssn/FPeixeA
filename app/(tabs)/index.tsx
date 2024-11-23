import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [temperatura, setTemperatura] = useState('Carregando...');
  const [timerAlimentacao, setTimerAlimentacao] = useState('Carregando...');

  const esp32Url = 'http://192.168.101.32/';

  const fetchData = async () => {
    // Código para buscar dados omitido para simplificar
  };

  const alimentar = async () => {
    try {
      const response = await axios.post(`${esp32Url}alimentar`);
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Comando de alimentação enviado!');
      } else {
        Alert.alert('Erro', 'Falha ao enviar comando');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', `Falha ao enviar comando: ${error.message}`);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>FPeixeA</Text>

      {/* Cards */}
      <View style={styles.card}>
        <Text style={styles.label}>Temperatura</Text>
        <Text style={styles.value}>{temperatura} Celsius</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Último Alimento</Text>
        <Text style={styles.value}>{timerAlimentacao}</Text>
      </View>

      {/* Botão de Alimentar */}
      <TouchableOpacity style={styles.button} onPress={alimentar}>
        <Text style={styles.buttonText}>Alimentar</Text>
      </TouchableOpacity>

      {/* Imagem das ondas na parte inferior */}
      <Image
        source={require('@/assets/images/waves.png')} // Substitua pelo caminho da sua imagem
        style={styles.waves}
        resizeMode="cover" // Ajusta a imagem para cobrir o espaço
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82CFFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  value: {
    fontSize: 22,
    color: '#333',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    zIndex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    zIndex: 0,
  },
});
