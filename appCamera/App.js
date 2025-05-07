import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [image, setImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  // Solicitar permissão ao iniciar o app
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasGalleryPermission(status === 'granted' && mediaStatus.status === 'granted');
    })();
  }, []);

  // Função para abrir a câmera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        
        // Salvar na galeria
        if (hasGalleryPermission) {
          try {
            await MediaLibrary.createAssetAsync(result.assets[0].uri);
            alert('Foto salva na galeria!');
          } catch (err) {
            console.log('Erro ao salvar foto:', err);
            alert('Não foi possível salvar na galeria.');
          }
        }
      }
    } catch (err) {
      console.log('Erro ao tirar foto:', err);
      alert('Ocorreu um erro ao usar a câmera.');
    }
  };

  // Retorno para quando não temos permissão
  if (hasGalleryPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Sem permissão para acessar a câmera ou galeria
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mostrar a imagem se ela existir */}
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* Área de botões */}
      <View style={styles.buttonArea}>
        <Button
          title={image ? "Tirar nova foto" : "Abrir câmera"}
          onPress={takePhoto}
        />

        {image && (
          <Button
            title="Limpar imagem"
            onPress={() => setImage(null)}
            color="#ff3b30"
          />
        )}
      </View>
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
  image: {
    width: '100%',
    height: '75%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});