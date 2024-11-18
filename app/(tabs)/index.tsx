import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [temperatura, setTemperatura] = useState('Carregando...');
  const [timerAlimentacao, setTimerAlimentacao] = useState('Carregando...');

  // Defina o IP do ESP32 na sua rede local
  const esp32Url = 'http://192.168.101.32/';

  // Função para buscar dados do ESP32
  const fetchData = async () => {
    try {
      const response = await axios.get(esp32Url);
      if (response.status === 200) {
        const data = response.data;
        setTemperatura(`${data.temperatura} °C`);
        setTimerAlimentacao(`${data.timerHora}h:${data.timerMinuto}m:${data.timerSegundo}s`);
      } else {
        Alert.alert('Erro', 'Falha ao buscar dados');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', `Falha ao buscar dados: ${error.message}`);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
      }
    }
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
    }, 500); // Atualiza a cada 500ms

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>F-PEIXE-A</Text>

      <Text style={styles.label}>Temperatura da água:</Text>
      <Text style={styles.value}>{temperatura}</Text>

      <Text style={styles.label}>Última alimentação há:</Text>
      <Text style={styles.value}>{timerAlimentacao}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Alimentar" onPress={alimentar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },
});
