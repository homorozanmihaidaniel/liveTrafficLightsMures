import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Play, Pause, RotateCcw, Sliders, Waypoints, Palette } from 'lucide-react-native';
import { INTERSECTIONS } from '../data/intersections';

export default function TimingControls({
  sim,
  activeTab,
}) {
  const {
    isRunning,
    togglePlayPause,
    speedMultiplier,
    setSpeedMultiplier,
    stepTime,
    resetSimulation,
    resetToDefaults,
    phi,
    minPhi,
    maxPhi,
    setPhi,
    T1,
    T2,
    T_ref,
    int1Phases,
    int1Yellow,
    int2Phases,
    int2Yellow,
    updatePhaseDuration,
    updateYellowDuration,
    colorMode,
    setColorMode,
  } = sim;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Bara de Control Redare Simulare */}
      <View style={styles.sectionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Sliders size={16} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Control Simulare Trafic</Text>
        </View>
        <View style={styles.playbackRow}>
          <TouchableOpacity
            style={[styles.playButton, isRunning ? styles.pauseBtn : styles.playBtn]}
            onPress={togglePlayPause}
          >
            {isRunning ? (
              <Pause size={15} color="#ffffff" fill="#ffffff" style={{ marginRight: 6 }} />
            ) : (
              <Play size={15} color="#ffffff" fill="#ffffff" style={{ marginRight: 6 }} />
            )}
            <Text style={styles.playButtonText}>
              {isRunning ? 'Pauză' : 'Pornește'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => stepTime(-5)}
          >
            <Text style={styles.actionBtnText}>-5s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => stepTime(5)}
          >
            <Text style={styles.actionBtnText}>+5s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={resetSimulation}
          >
            <RotateCcw size={12} color="#cbd5e1" style={{ marginRight: 4 }} />
            <Text style={styles.actionBtnText}>Reset T=0</Text>
          </TouchableOpacity>
        </View>

        {/* Multiplicator viteză */}
        <View style={styles.speedRow}>
          <Text style={styles.labelText}>Viteză simulare:</Text>
          {[0.5, 1, 2, 5, 10].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.speedBadge,
                speedMultiplier === s && styles.speedBadgeActive,
              ]}
              onPress={() => setSpeedMultiplier(s)}
            >
              <Text
                style={[
                  styles.speedText,
                  speedMultiplier === s && styles.speedTextActive,
                ]}
              >
                {s}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mod Culori Carosabil */}
        <View style={styles.colorModeRow}>
          <Text style={styles.labelText}>Stil culori drumuri:</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                colorMode === 'sketch' && styles.toggleBtnActive,
              ]}
              onPress={() => setColorMode('sketch')}
            >
              <Palette size={13} color={colorMode === 'sketch' ? '#ffffff' : '#94a3b8'} style={{ marginRight: 5 }} />
              <Text
                style={[
                  styles.toggleBtnText,
                  colorMode === 'sketch' && styles.toggleBtnTextActive,
                ]}
              >
                Culori Schiță (V/P/R/A)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                colorMode === 'traffic' && styles.toggleBtnActive,
              ]}
              onPress={() => setColorMode('traffic')}
            >
              <Waypoints size={13} color={colorMode === 'traffic' ? '#ffffff' : '#94a3b8'} style={{ marginRight: 5 }} />
              <Text
                style={[
                  styles.toggleBtnText,
                  colorMode === 'traffic' && styles.toggleBtnTextActive,
                ]}
              >
                Standard (Verde/Galben)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. CONTROLUL DECALAJULUI DE FAZĂ PHI (fi) în intervalul [-T/2, T/2] */}
      {/* ============================================================== */}
      <View style={[styles.sectionCard, styles.phiHighlightCard]}>
        <View style={styles.phiHeaderRow}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Sliders size={15} color="#38bdf8" style={{ marginRight: 6 }} />
              <Text style={styles.phiTitle}>Decalaj de Fază φ (Fi)</Text>
            </View>
            <Text style={styles.phiSubtext}>
              Interval: [-T/2, T/2] = [{minPhi}s, +{maxPhi}s] (T = {T_ref}s)
            </Text>
          </View>
          <View style={styles.phiValueBadge}>
            <Text style={styles.phiValueText}>
              {phi > 0 ? `+${phi}s` : `${phi}s`}
            </Text>
          </View>
        </View>

        <Text style={styles.phiDesc}>
          Parametrul φ decalează pornirea Intersecției 2 față de Intersecția 1 pentru coordonare rutieră (&quot;Undă Verde&quot;).
        </Text>

        {/* Butoane pas cu pas pentru φ */}
        <View style={styles.phiButtonsRow}>
          <TouchableOpacity
            style={styles.phiBtn}
            onPress={() => setPhi(phi - 10)}
          >
            <Text style={styles.phiBtnText}>-10s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.phiBtn}
            onPress={() => setPhi(phi - 1)}
          >
            <Text style={styles.phiBtnText}>-1s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.phiBtn, styles.phiResetBtn]}
            onPress={() => setPhi(0)}
          >
            <Text style={styles.phiBtnText}>φ = 0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.phiBtn}
            onPress={() => setPhi(phi + 1)}
          >
            <Text style={styles.phiBtnText}>+1s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.phiBtn}
            onPress={() => setPhi(phi + 10)}
          >
            <Text style={styles.phiBtnText}>+10s</Text>
          </TouchableOpacity>
        </View>

        {/* Preseturi rapide raportate la T */}
        <View style={styles.presetsRow}>
          <Text style={styles.presetLabel}>Preseturi:</Text>
          <TouchableOpacity
            style={styles.presetChip}
            onPress={() => setPhi(minPhi)}
          >
            <Text style={styles.presetChipText}>-T/2 ({minPhi}s)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetChip}
            onPress={() => setPhi(Math.round(minPhi / 2))}
          >
            <Text style={styles.presetChipText}>-T/4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetChip}
            onPress={() => setPhi(Math.round(maxPhi / 2))}
          >
            <Text style={styles.presetChipText}>+T/4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetChip}
            onPress={() => setPhi(maxPhi)}
          >
            <Text style={styles.presetChipText}>+T/2 (+{maxPhi}s)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Configurare Timpi Intersecția 1 (4 faze) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Waypoints size={16} color="#38bdf8" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>
              Timpi Intersecția 1 (4 Faze)
            </Text>
          </View>
          <Text style={styles.periodBadge}>
            T₁ = {T1}s (2m 20s)
          </Text>
        </View>
        <Text style={styles.helperText}>
          Modifică secundele de verde pentru fiecare direcție și timpul de galben:
        </Text>

        {INTERSECTIONS[0].phases.map((ph, idx) => (
          <View key={ph.id} style={styles.timingItemRow}>
            <View style={styles.phaseLabelContainer}>
              <View
                style={[styles.smallDot, { backgroundColor: ph.sketchColor }]}
              />
              <Text style={styles.phaseItemName}>
                Faza {ph.id} ({ph.themeName}):
              </Text>
            </View>

            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  updatePhaseDuration('int1', idx, int1Phases[idx] - 5)
                }
              >
                <Text style={styles.stepBtnText}>-5</Text>
              </TouchableOpacity>
              <Text style={styles.durationValue}>{int1Phases[idx]}s</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  updatePhaseDuration('int1', idx, int1Phases[idx] + 5)
                }
              >
                <Text style={styles.stepBtnText}>+5</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Timp Galben Intersecția 1 */}
        <View style={[styles.timingItemRow, styles.yellowRow]}>
          <View style={styles.phaseLabelContainer}>
            <View style={[styles.smallDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.phaseItemName}>Timp Galben (Tranziție):</Text>
          </View>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => updateYellowDuration('int1', int1Yellow - 1)}
            >
              <Text style={styles.stepBtnText}>-1</Text>
            </TouchableOpacity>
            <Text style={styles.durationValue}>{int1Yellow}s</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => updateYellowDuration('int1', int1Yellow + 1)}
            >
              <Text style={styles.stepBtnText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 4. Configurare Timpi Intersecția 2 (3 faze) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Waypoints size={16} color="#38bdf8" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>
              Timpi Intersecția 2 (3 Faze)
            </Text>
          </View>
          <Text style={styles.periodBadge}>
            T₂ = {T2}s (1m 30s)
          </Text>
        </View>
        <Text style={styles.helperText}>
          Faza 3 pe axul principal Vest are inițial 45s conform schiței:
        </Text>

        {INTERSECTIONS[1].phases.map((ph, idx) => (
          <View key={ph.id} style={styles.timingItemRow}>
            <View style={styles.phaseLabelContainer}>
              <View
                style={[styles.smallDot, { backgroundColor: ph.sketchColor }]}
              />
              <Text style={styles.phaseItemName}>
                Faza {ph.id} ({ph.themeName}):
              </Text>
            </View>

            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  updatePhaseDuration('int2', idx, int2Phases[idx] - 5)
                }
              >
                <Text style={styles.stepBtnText}>-5</Text>
              </TouchableOpacity>
              <Text style={styles.durationValue}>{int2Phases[idx]}s</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() =>
                  updatePhaseDuration('int2', idx, int2Phases[idx] + 5)
                }
              >
                <Text style={styles.stepBtnText}>+5</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Timp Galben Intersecția 2 */}
        <View style={[styles.timingItemRow, styles.yellowRow]}>
          <View style={styles.phaseLabelContainer}>
            <View style={[styles.smallDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.phaseItemName}>Timp Galben (Tranziție):</Text>
          </View>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => updateYellowDuration('int2', int2Yellow - 1)}
            >
              <Text style={styles.stepBtnText}>-1</Text>
            </TouchableOpacity>
            <Text style={styles.durationValue}>{int2Yellow}s</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => updateYellowDuration('int2', int2Yellow + 1)}
            >
              <Text style={styles.stepBtnText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Buton Resetare Completă la Valorile din Schițe */}
      <TouchableOpacity
        style={styles.resetDefaultsBtn}
        onPress={resetToDefaults}
      >
        <RotateCcw size={15} color="#cbd5e1" style={{ marginRight: 6 }} />
        <Text style={styles.resetDefaultsText}>
          Resetează toți timpii la Valorile din Schițe (2m20s / 1m30s)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  phiHighlightCard: {
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.06)',
  },
  phiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  phiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  phiSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  phiValueBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  phiValueText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  phiDesc: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 8,
  },
  phiButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  phiBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  phiResetBtn: {
    backgroundColor: '#0369a1',
  },
  phiBtnText: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 13,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  presetLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  presetChip: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  presetChipText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  periodBadge: {
    backgroundColor: '#334155',
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  helperText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 12,
  },
  playbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playButton: {
    flex: 1.5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  playBtn: {
    backgroundColor: '#10b981',
  },
  pauseBtn: {
    backgroundColor: '#f59e0b',
  },
  playButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionBtn: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 6,
  },
  actionBtnText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 12,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  labelText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  speedBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  speedBadgeActive: {
    backgroundColor: '#3b82f6',
  },
  speedText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  speedTextActive: {
    color: '#ffffff',
  },
  colorModeRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  toggleRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 3,
  },
  toggleBtnActive: {
    backgroundColor: '#2563eb',
  },
  toggleBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
  },
  timingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  yellowRow: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    marginTop: 4,
  },
  phaseLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  phaseItemName: {
    color: '#f8fafc',
    fontSize: 13,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    backgroundColor: '#334155',
    width: 34,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 13,
  },
  durationValue: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 15,
    width: 48,
    textAlign: 'center',
  },
  resetDefaultsBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1.5,
    borderColor: '#475569',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  resetDefaultsText: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
