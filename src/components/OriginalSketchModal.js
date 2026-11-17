import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function OriginalSketchModal({ visible, onClose, intersectionId }) {
  const isInt1 = intersectionId === 'int1';
  const sketchImg = isInt1
    ? require('../../assets/sketches/intersection1.jpg')
    : require('../../assets/sketches/intersection2.jpg');

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              {isInt1
                ? 'Schiță Originală: Intersecția 1'
                : 'Schiță Originală: Intersecția 2'}
            </Text>
            <Text style={styles.headerSub}>
              {isInt1
                ? 'Coordonate: 46°32\'47.3"N 24°34\'07.4"E'
                : 'Coordonate: 46°32\'47.1"N 24°33\'48.9"E'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕ Închide</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageWrapper}>
            <Image
              source={sketchImg}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>📋 Note din Desenul Tău:</Text>
            {isInt1 ? (
              <View>
                <Text style={styles.noteLine}>🟢 Faza 1: 30s (Verde - acces din Est / N. Iorga)</Text>
                <Text style={styles.noteLine}>🟠 Faza 2: 30s (Portocaliu - acces din Sud / Papiu)</Text>
                <Text style={styles.noteLine}>🌸 Faza 3: 30s (Roz - acces din Vest / Centru)</Text>
                <Text style={styles.noteLine}>🔵 Faza 4: 30s (Albastru - acces din Nord / Bernády)</Text>
                <Text style={styles.noteLineTotal}>⏱️ Perioadă totală notată: 2 min 20 sec</Text>
                <Text style={styles.noteExplain}>
                  * Calcul: 4 faze x 30s verde = 120s + 4 tranziții galbene de 5s = 140s (2m 20s).
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.noteLine}>🟢 Faza 1: (Verde - Est & viraj spre Parcare Nord)</Text>
                <Text style={styles.noteLine}>🟠 Faza 2: (Portocaliu - Sud spre Vest & Parcare)</Text>
                <Text style={styles.noteLine}>🌸 Faza 3: 45s (Roz - Ax Principal Vest spre Est)</Text>
                <Text style={styles.noteLineTotal}>⏱️ Perioadă totală notată: 1 min 30 sec</Text>
                <Text style={styles.noteExplain}>
                  * Calcul: Faza principală 45s + fazele secundare și timpii galbeni de eliberare = 90s (1m 30s).
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  legendCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  legendTitle: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteLine: {
    color: '#f8fafc',
    fontSize: 14,
    marginBottom: 6,
  },
  noteLineTotal: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
  },
  noteExplain: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
