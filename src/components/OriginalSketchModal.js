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
import { Camera, X, FileText, Clock } from 'lucide-react-native';

export default function OriginalSketchModal({ visible, onClose, intersectionId }) {
  const isInt1 = intersectionId === 'int1';
  const sketchImg = isInt1
    ? require('../../assets/sketches/intersection1.jpg')
    : require('../../assets/sketches/intersection2.jpg');

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Camera size={16} color="#38bdf8" style={{ marginRight: 6 }} />
              <Text style={styles.headerTitle}>
                {isInt1
                  ? 'Schiță Originală: Intersecția 1'
                  : 'Schiță Originală: Intersecția 2'}
              </Text>
            </View>
            <Text style={styles.headerSub}>
              {isInt1
                ? 'Coordonate: 46°32\'47.3"N 24°34\'07.4"E'
                : 'Coordonate: 46°32\'47.1"N 24°33\'48.9"E'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={15} color="#cbd5e1" style={{ marginRight: 4 }} />
            <Text style={styles.closeBtnText}>Închide</Text>
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
            <View style={styles.legendHeaderRow}>
              <FileText size={16} color="#38bdf8" style={{ marginRight: 6 }} />
              <Text style={styles.legendTitle}>Note din Desenul Tău:</Text>
            </View>
            {isInt1 ? (
              <View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#22c55e' }]} />
                  <Text style={styles.noteLine}>Faza 1: 30s (Verde - acces din Est / N. Iorga)</Text>
                </View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#f97316' }]} />
                  <Text style={styles.noteLine}>Faza 2: 30s (Portocaliu - acces din Sud / Papiu)</Text>
                </View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#ec4899' }]} />
                  <Text style={styles.noteLine}>Faza 3: 30s (Roz - acces din Vest / Centru)</Text>
                </View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#3b82f6' }]} />
                  <Text style={styles.noteLine}>Faza 4: 30s (Albastru - acces din Nord / Bernády)</Text>
                </View>
                <View style={styles.totalRow}>
                  <Clock size={13} color="#38bdf8" style={{ marginRight: 5 }} />
                  <Text style={styles.noteLineTotal}>Perioadă totală notată: 2 min 20 sec</Text>
                </View>
                <Text style={styles.noteExplain}>
                  * Calcul: 4 faze x 30s verde = 120s + 4 tranziții galbene de 5s = 140s (2m 20s).
                </Text>
              </View>
            ) : (
              <View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#22c55e' }]} />
                  <Text style={styles.noteLine}>Faza 1: (Verde - Est & viraj spre Parcare Nord)</Text>
                </View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#f97316' }]} />
                  <Text style={styles.noteLine}>Faza 2: (Portocaliu - Sud spre Vest & Parcare)</Text>
                </View>
                <View style={styles.noteRow}>
                  <View style={[styles.phaseDot, { backgroundColor: '#ec4899' }]} />
                  <Text style={styles.noteLine}>Faza 3: 45s (Roz - Ax Principal Vest spre Est)</Text>
                </View>
                <View style={styles.totalRow}>
                  <Clock size={13} color="#38bdf8" style={{ marginRight: 5 }} />
                  <Text style={styles.noteLineTotal}>Perioadă totală notată: 1 min 30 sec</Text>
                </View>
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
    backgroundColor: '#0c111c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#131924',
    borderBottomWidth: 1,
    borderBottomColor: '#242c38',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 2,
  },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  closeBtnText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imageWrapper: {
    backgroundColor: '#131924',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242c38',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 350,
  },
  image: {
    width: '100%',
    height: 450,
  },
  legendCard: {
    backgroundColor: '#131924',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242c38',
  },
  legendHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  noteLine: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  noteLineTotal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  noteExplain: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
  },
});
