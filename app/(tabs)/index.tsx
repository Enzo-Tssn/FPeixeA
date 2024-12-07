import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [temperatura, setTemperatura] = useState('Carregando...');
  const [timerAlimentacao, setTimerAlimentacao] = useState('Carregando...');
  const [alertaTemp, setAlertaTemp] = useState('Temperatura');

  const esp32Url = 'http://192.168.101.32/';

  const fetchData = async () => {
    try {
      const response = await axios.get(esp32Url);
      if (response.status === 200) {
        const data = response.data;
  
        // Formatar a temperatura para ter uma casa decimal
        const formattedTemperatura = data.temperatura.toFixed(1); // Garante uma casa decimal
  
        // Formatar o tempo para ter dois dígitos para hora, minuto e segundo
        const formattedHora = data.timerHora.toString().padStart(2, '0'); // Garante dois dígitos
        const formattedMinuto = data.timerMinuto.toString().padStart(2, '0');
        const formattedSegundo = data.timerSegundo.toString().padStart(2, '0');
  
        if (formattedTemperatura < 24) setAlertaTemp('⚠️ Temperatura muito baixa!');
        else setAlertaTemp('Temperatura');

        setTemperatura(`${formattedTemperatura} °C`);
        setTimerAlimentacao(`${formattedHora}h${formattedMinuto}m${formattedSegundo}s`);
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
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
      />

      {/* Cards */}
      <View style={styles.card}>
        <Text style={styles.label}>{alertaTemp}</Text>
        <Text style={styles.value}>{temperatura}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Última alimentação há</Text>
        <Text style={styles.value}>{timerAlimentacao}</Text>
      </View>

      {/* Botão de Alimentar */}
      <TouchableOpacity style={styles.button} onPress={alimentar}>
        <Text style={styles.buttonText}>Alimentar</Text>
      </TouchableOpacity>

      {/* Imagem das ondas na parte inferior */}
      <Image
        source={require('@/assets/images/waves.png')}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 72,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginVertical: 24,
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
    backgroundColor: '#0939B0',
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
