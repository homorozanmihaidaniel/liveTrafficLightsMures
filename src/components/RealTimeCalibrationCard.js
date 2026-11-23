import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Radio, Clock, Target, Zap, RotateCcw } from 'lucide-react-native';
import { formatMinutesSeconds } from '../utils/formatters';

export default function RealTimeCalibrationCard({
  intersection,
  state,
  phoneTimeStr,
  lastCalibratedTime,
  onCalibratePhase,
  onFineTune,
  onResetCalibration,
}) {
  const [selectedPhaseToSync, setSelectedPhaseToSync] = useState(0);

  const { currentCycleTime, T, signalState, timeRemainingInState } = state;

  const currentSec = Math.floor(currentCycleTime);
  const totalSec = Math.round(T);

  return (
    <View style={styles.card}>
      {/* Header card */}
      <View style={styles.headerRow}>
        <View style={styles.liveIndicatorRow}>
          <Radio size={12} color="#ef4444" style={{ marginRight: 6 }} />
          <Text style={styles.liveBadgeText}>SINCRONIZARE LIVE (TIMP REAL)</Text>
        </View>

        <View style={styles.phoneClockBadge}>
          <Clock size={12} color="#38bdf8" style={{ marginRight: 5 }} />
          <Text style={styles.phoneClockText}>{phoneTimeStr}</Text>
        </View>
      </View>

      <Text style={styles.descriptionText}>
        Aplicația rulează pe <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>ceasul intern al telefonului</Text>. Dacă închizi sau oprești aplicația, la redeschidere semaforul își reia exact momentul din realitate, fără decalaj.
      </Text>

      {/* Info Ciclu Curent */}
      <View style={styles.cycleInfoBox}>
        <View style={styles.cycleInfoItem}>
          <Text style={styles.infoLabel}>Secunda în ciclu</Text>
          <Text style={styles.infoValue}>
            {currentSec}s <Text style={styles.infoValueSub}>/ {formatMinutesSeconds(totalSec)}</Text>
          </Text>
        </View>

        <View style={styles.cycleInfoDivider} />

        <View style={styles.cycleInfoItem}>
          <Text style={styles.infoLabel}>Faza curentă</Text>
          <View style={styles.phaseStateRow}>
            <View
              style={[
                styles.signalIndicatorDot,
                {
                  backgroundColor:
                    signalState === 'GREEN'
                      ? '#22c55e'
                      : signalState === 'YELLOW'
                      ? '#f59e0b'
                      : '#ef4444',
                },
              ]}
            />
            <Text
              style={[
                styles.infoValue,
                {
                  color:
                    signalState === 'GREEN'
                      ? '#22c55e'
                      : signalState === 'YELLOW'
                      ? '#f59e0b'
                      : '#ef4444',
                },
              ]}
            >
              {signalState === 'GREEN'
                ? 'VERDE'
                : signalState === 'YELLOW'
                ? 'GALBEN'
                : 'PUNCT MORT'}{' '}
              ({Math.ceil(timeRemainingInState)}s)
            </Text>
          </View>
        </View>

        <View style={styles.cycleInfoDivider} />

        <View style={styles.cycleInfoItem}>
          <Text style={styles.infoLabel}>Stare calibrare</Text>
          <View style={styles.calibStatusRow}>
            {lastCalibratedTime ? (
              <Target size={11} color="#38bdf8" style={{ marginRight: 4 }} />
            ) : (
              <Clock size={11} color="#94a3b8" style={{ marginRight: 4 }} />
            )}
            <Text style={styles.calibStatusText}>
              {lastCalibratedTime ? lastCalibratedTime : 'Miezul nopții'}
            </Text>
          </View>
        </View>
      </View>

      {/* Secțiunea Calibrare 1-Tap la fața locului */}
      <View style={styles.syncSection}>
        <View style={styles.syncSectionHeader}>
          <Target size={14} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.syncSectionTitle}>
            Calibrare la fața locului (când ești în intersecție):
          </Text>
        </View>
        <Text style={styles.syncSectionSubtitle}>
          Alege faza pe care o vezi aprinsă și apasă butonul în momentul în care trece pe verde:
        </Text>

        {/* Butoane alegere fază pentru calibrare */}
        <View style={styles.phasesSelectorRow}>
          {intersection.phases.map((phase, idx) => (
            <TouchableOpacity
              key={phase.id}
              style={[
                styles.phaseSelectBtn,
                selectedPhaseToSync === idx && styles.phaseSelectBtnActive,
              ]}
              onPress={() => setSelectedPhaseToSync(idx)}
            >
              <Text
                style={[
                  styles.phaseSelectBtnText,
                  selectedPhaseToSync === idx && styles.phaseSelectBtnTextActive,
                ]}
              >
                Faza {phase.id}
              </Text>
              <Text
                style={[
                  styles.phaseSelectSubText,
                  selectedPhaseToSync === idx && styles.phaseSelectSubTextActive,
                ]}
                numberOfLines={1}
              >
                {phase.branchName || phase.name.split(':')[1]?.trim()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Butonul principal de sincronizare */}
        <TouchableOpacity
          style={styles.mainSyncButton}
          onPress={() => onCalibratePhase(selectedPhaseToSync)}
          activeOpacity={0.8}
        >
          <View style={styles.mainSyncButtonContent}>
            <Zap size={15} color="#ffffff" fill="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.mainSyncButtonText}>
              SEMAFORUL A TRECUT PE VERDE LA FAZA {selectedPhaseToSync + 1} ACUM!
            </Text>
          </View>
          <Text style={styles.mainSyncButtonSub}>
            (Apasă exact în secunda în care se aprinde verdele la {intersection.phases[selectedPhaseToSync]?.name})
          </Text>
        </TouchableOpacity>

        {/* Butoane reglaj fin (+/- 1s sau 5s) */}
        <View style={styles.fineTuneRow}>
          <Text style={styles.fineTuneLabel}>Ajustare fină secundă:</Text>

          <View style={styles.fineTuneButtons}>
            <TouchableOpacity
              style={styles.tuneBtn}
              onPress={() => onFineTune(-5)}
            >
              <Text style={styles.tuneBtnText}>-5s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tuneBtn}
              onPress={() => onFineTune(-1)}
            >
              <Text style={styles.tuneBtnText}>-1s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tuneBtn}
              onPress={() => onFineTune(+1)}
            >
              <Text style={styles.tuneBtnText}>+1s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tuneBtn}
              onPress={() => onFineTune(+5)}
            >
              <Text style={styles.tuneBtnText}>+5s</Text>
            </TouchableOpacity>

            {lastCalibratedTime && (
              <TouchableOpacity
                style={styles.resetCalibBtn}
                onPress={onResetCalibration}
              >
                <RotateCcw size={11} color="#cbd5e1" style={{ marginRight: 4 }} />
                <Text style={styles.resetCalibBtnText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131924',
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#242c38',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  liveBadgeText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  phoneClockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  phoneClockText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  descriptionText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 12,
  },
  cycleInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#0c111c',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cycleInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  cycleInfoDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#1e293b',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 10,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
  },
  phaseStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  infoValueSub: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: 'normal',
  },
  calibStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calibStatusText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  syncSection: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  syncSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  syncSectionTitle: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: 'bold',
  },
  syncSectionSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
  },
  phasesSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  phaseSelectBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  phaseSelectBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  phaseSelectBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  phaseSelectBtnTextActive: {
    color: '#ffffff',
  },
  phaseSelectSubText: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  phaseSelectSubTextActive: {
    color: '#e0f2fe',
  },
  mainSyncButton: {
    backgroundColor: '#15803d',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22c55e',
    marginBottom: 12,
  },
  mainSyncButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainSyncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  mainSyncButtonSub: {
    color: '#bbf7d0',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  fineTuneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10,
  },
  fineTuneLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  fineTuneButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tuneBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  tuneBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetCalibBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  resetCalibBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
});
