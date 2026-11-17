import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTrafficSimulation } from './src/hooks/useTrafficSimulation';
import { INTERSECTIONS } from './src/data/intersections';
import { INT1_GEOMETRY } from './src/data/intersection1Geometry';
import { INT2_GEOMETRY } from './src/data/intersection2Geometry';
import IntersectionVisualizer from './src/components/IntersectionVisualizer';
import CoordinatedView from './src/components/CoordinatedView';
import OriginalSketchModal from './src/components/OriginalSketchModal';
import RealTimeCalibrationCard from './src/components/RealTimeCalibrationCard';

export default function App() {
  // Selector la început între cele 2 intersecții și Unda Verde
  const [selectedIntersection, setSelectedIntersection] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '').split('?')[0];
      if (['int1', 'int2', 'coordinated'].includes(h)) return h;
    }
    return 'int1';
  });

  const [sketchModalVisible, setSketchModalVisible] = useState(false);
  const sim = useTrafficSimulation();

  const {
    // Mod ceas & Timp telefon
    clockMode,
    setClockMode,
    phoneTimeStr,
    isRealTime,

    // Timpi activi
    simTime,
    activeTimeInt1,
    activeTimeInt2,

    // Calibrare la fața locului
    lastCalibTimeInt1,
    lastCalibTimeInt2,
    calibratePhaseNow,
    fineTuneOffset,
    resetCalibration,

    // Stări simulare
    isRunning,
    togglePlayPause,
    resetToDefaults,
    speedMultiplier,
    setSpeedMultiplier,
    phi,
    minPhi,
    maxPhi,
    setPhi,
    T1,
    T2,
    T_ref,
    int1State,
    int2State,
    int1Yellow,
    int2Yellow,
    updatePhaseDuration,
    updateYellowDuration,
  } = sim;

  const currentT = selectedIntersection === 'int2' ? T2 : T1;
  const currentMinPhi = -Math.round(currentT / 2);
  const currentMaxPhi = Math.round(currentT / 2);

  const activeState = selectedIntersection === 'int2' ? int2State : int1State;
  const currentCycleSec = Math.floor(activeState?.currentCycleTime || 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Antet Modernizat cu Comutator Mod Timp Real / Simulare */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.appTitle}>🚦 Semafoare Tg. Mureș</Text>
            {isRealTime ? (
              <View style={styles.liveHeaderBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveHeaderText}>LIVE</Text>
              </View>
            ) : (
              <View style={styles.simHeaderBadge}>
                <Text style={styles.simHeaderText}>SIMULARE</Text>
              </View>
            )}
          </View>

          <Text style={styles.appSubtitle}>
            {isRealTime
              ? `Ora: ${phoneTimeStr} • Secunda ${currentCycleSec}s / ${currentT}s`
              : `Timp Simulat: ${Math.floor(simTime)}s • Viteză ${speedMultiplier}x`}
          </Text>
        </View>

        {/* Butoane Header (Schiță & Play/Pause în Simulare) */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.sketchBtn}
            onPress={() => setSketchModalVisible(true)}
          >
            <Text style={styles.sketchBtnText}>📷 Schiță</Text>
          </TouchableOpacity>

          {!isRealTime && (
            <TouchableOpacity
              style={[
                styles.playBtn,
                isRunning ? styles.playBtnActive : styles.pauseBtnActive,
              ]}
              onPress={togglePlayPause}
            >
              <Text style={styles.playBtnText}>{isRunning ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Selector Mod Ceas: LIVE (Ceas Telefon) vs SIMULARE */}
      <View style={styles.modeBar}>
        <TouchableOpacity
          style={[
            styles.modeBtn,
            isRealTime && styles.modeBtnActiveRealtime,
          ]}
          onPress={() => setClockMode('realtime')}
        >
          <View style={isRealTime ? styles.pulseDot : styles.inactiveDot} />
          <Text
            style={[
              styles.modeBtnText,
              isRealTime && styles.modeBtnTextActive,
            ]}
          >
            🔴 Timp Real (Ceas Telefon)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeBtn,
            !isRealTime && styles.modeBtnActiveSim,
          ]}
          onPress={() => setClockMode('simulated')}
        >
          <Text
            style={[
              styles.modeBtnText,
              !isRealTime && styles.modeBtnTextActive,
            ]}
          >
            🧪 Mod Simulare
          </Text>
        </TouchableOpacity>
      </View>

      {/* SELECTOR PRINCIPAL INTERSECȚII */}
      <View style={styles.selectorBar}>
        <TouchableOpacity
          style={[
            styles.selectorTab,
            selectedIntersection === 'int1' && styles.selectorTabActive,
          ]}
          onPress={() => setSelectedIntersection('int1')}
        >
          <Text
            style={[
              styles.selectorTabText,
              selectedIntersection === 'int1' && styles.selectorTabTextActive,
            ]}
          >
            🚦 Intersecția 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorTab,
            selectedIntersection === 'int2' && styles.selectorTabActive,
          ]}
          onPress={() => setSelectedIntersection('int2')}
        >
          <Text
            style={[
              styles.selectorTabText,
              selectedIntersection === 'int2' && styles.selectorTabTextActive,
            ]}
          >
            🚦 Intersecția 2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorTab,
            selectedIntersection === 'coordinated' && styles.selectorTabActive,
          ]}
          onPress={() => setSelectedIntersection('coordinated')}
        >
          <Text
            style={[
              styles.selectorTabText,
              selectedIntersection === 'coordinated' && styles.selectorTabTextActive,
            ]}
          >
            🌊 Undă Verde (φ)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conținut Ecran */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainContent}
      >
        {/* Caz 1: Intersecția 1 */}
        {selectedIntersection === 'int1' && (
          <View>
            <IntersectionVisualizer
              intersection={INTERSECTIONS[0]}
              geometry={INT1_GEOMETRY}
              state={int1State}
              simTime={activeTimeInt1}
              yellowDuration={int1Yellow}
              onUpdatePhaseDuration={updatePhaseDuration}
              onUpdateYellowDuration={updateYellowDuration}
            />

            {/* Card dedicat Sincronizare Live & Calibrare */}
            {isRealTime && (
              <RealTimeCalibrationCard
                intersection={INTERSECTIONS[0]}
                state={int1State}
                phoneTimeStr={phoneTimeStr}
                lastCalibratedTime={lastCalibTimeInt1}
                onCalibratePhase={(phaseIdx) => calibratePhaseNow('int1', phaseIdx)}
                onFineTune={(delta) => fineTuneOffset('int1', delta)}
                onResetCalibration={() => resetCalibration('int1')}
                isRealTime={isRealTime}
              />
            )}

            {/* Secțiune Reglare Decalaj Fi direct sub hartă */}
            <View style={styles.phiCard}>
              <View style={styles.phiHeader}>
                <View>
                  <Text style={styles.phiTitle}>📐 Reglare Decalaj de Fază φ (Fi):</Text>
                  <Text style={styles.phiSub}>
                    Interval: [-T/2, +T/2] = [{currentMinPhi}s, +{currentMaxPhi}s] • T = {currentT}s
                  </Text>
                </View>
                <View style={styles.phiBadge}>
                  <Text style={styles.phiBadgeText}>
                    φ = {phi > 0 ? `+${phi}s` : `${phi}s`}
                  </Text>
                </View>
              </View>

              <View style={styles.phiButtonsRow}>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi - 5)}>
                  <Text style={styles.phiBtnText}>-5s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi - 1)}>
                  <Text style={styles.phiBtnText}>-1s</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.phiBtn, styles.phiResetBtn]}
                  onPress={() => setPhi(0)}
                >
                  <Text style={styles.phiBtnText}>φ = 0s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi + 1)}>
                  <Text style={styles.phiBtnText}>+1s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi + 5)}>
                  <Text style={styles.phiBtnText}>+5s</Text>
                </TouchableOpacity>
              </View>

              {/* Viteză & Resetare */}
              <View style={styles.bottomQuickRow}>
                {!isRealTime ? (
                  <View style={styles.speedGroup}>
                    <Text style={styles.speedLabel}>Viteză:</Text>
                    {[1, 2, 5].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.speedPill,
                          speedMultiplier === s && styles.speedPillActive,
                        ]}
                        onPress={() => setSpeedMultiplier(s)}
                      >
                        <Text
                          style={[
                            styles.speedPillText,
                            speedMultiplier === s && styles.speedPillTextActive,
                          ]}
                        >
                          {s}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.speedGroup}>
                    <Text style={styles.speedLabel}>Viteză:</Text>
                    <View style={[styles.speedPill, styles.speedPillActive]}>
                      <Text style={[styles.speedPillText, styles.speedPillTextActive]}>
                        1x (Timp Real)
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={resetToDefaults}
                >
                  <Text style={styles.resetBtnText}>🔄 Reset Schiță</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Caz 2: Intersecția 2 */}
        {selectedIntersection === 'int2' && (
          <View>
            <IntersectionVisualizer
              intersection={INTERSECTIONS[1]}
              geometry={INT2_GEOMETRY}
              state={int2State}
              simTime={activeTimeInt2}
              yellowDuration={int2Yellow}
              onUpdatePhaseDuration={updatePhaseDuration}
              onUpdateYellowDuration={updateYellowDuration}
            />

            {/* Card dedicat Sincronizare Live & Calibrare */}
            {isRealTime && (
              <RealTimeCalibrationCard
                intersection={INTERSECTIONS[1]}
                state={int2State}
                phoneTimeStr={phoneTimeStr}
                lastCalibratedTime={lastCalibTimeInt2}
                onCalibratePhase={(phaseIdx) => calibratePhaseNow('int2', phaseIdx)}
                onFineTune={(delta) => fineTuneOffset('int2', delta)}
                onResetCalibration={() => resetCalibration('int2')}
                isRealTime={isRealTime}
              />
            )}

            {/* Secțiune Reglare Decalaj Fi direct sub hartă */}
            <View style={styles.phiCard}>
              <View style={styles.phiHeader}>
                <View>
                  <Text style={styles.phiTitle}>📐 Reglare Decalaj de Fază φ (Fi):</Text>
                  <Text style={styles.phiSub}>
                    Interval: [-T/2, +T/2] = [{currentMinPhi}s, +{currentMaxPhi}s] • T = {currentT}s
                  </Text>
                </View>
                <View style={styles.phiBadge}>
                  <Text style={styles.phiBadgeText}>
                    φ = {phi > 0 ? `+${phi}s` : `${phi}s`}
                  </Text>
                </View>
              </View>

              <View style={styles.phiButtonsRow}>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi - 5)}>
                  <Text style={styles.phiBtnText}>-5s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi - 1)}>
                  <Text style={styles.phiBtnText}>-1s</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.phiBtn, styles.phiResetBtn]}
                  onPress={() => setPhi(0)}
                >
                  <Text style={styles.phiBtnText}>φ = 0s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi + 1)}>
                  <Text style={styles.phiBtnText}>+1s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phiBtn} onPress={() => setPhi(phi + 5)}>
                  <Text style={styles.phiBtnText}>+5s</Text>
                </TouchableOpacity>
              </View>

              {/* Viteză & Resetare */}
              <View style={styles.bottomQuickRow}>
                {!isRealTime ? (
                  <View style={styles.speedGroup}>
                    <Text style={styles.speedLabel}>Viteză:</Text>
                    {[1, 2, 5].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.speedPill,
                          speedMultiplier === s && styles.speedPillActive,
                        ]}
                        onPress={() => setSpeedMultiplier(s)}
                      >
                        <Text
                          style={[
                            styles.speedPillText,
                            speedMultiplier === s && styles.speedPillTextActive,
                          ]}
                        >
                          {s}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.speedGroup}>
                    <Text style={styles.speedLabel}>Viteză:</Text>
                    <View style={[styles.speedPill, styles.speedPillActive]}>
                      <Text style={[styles.speedPillText, styles.speedPillTextActive]}>
                        1x (Timp Real)
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={resetToDefaults}
                >
                  <Text style={styles.resetBtnText}>🔄 Reset Schiță</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Caz 3: Undă Verde (Coordonare ambele intersecții pe coridorul de 400m) */}
        {selectedIntersection === 'coordinated' && <CoordinatedView sim={sim} />}
      </ScrollView>

      {/* Modal consultare schiță originală */}
      <OriginalSketchModal
        visible={sketchModalVisible}
        onClose={() => setSketchModalVisible(false)}
        intersectionId={selectedIntersection === 'int2' ? 'int2' : 'int1'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c111c',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#131924',
    borderBottomWidth: 1,
    borderBottomColor: '#242c38',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  liveHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 4,
  },
  liveHeaderText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  simHeaderBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  simHeaderText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 2,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sketchBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  sketchBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnActive: {
    backgroundColor: '#f59e0b',
  },
  pauseBtnActive: {
    backgroundColor: '#22c55e',
  },
  playBtnText: {
    fontSize: 16,
  },
  modeBar: {
    flexDirection: 'row',
    backgroundColor: '#0c111c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#131924',
    borderWidth: 1,
    borderColor: '#242c38',
  },
  modeBtnActiveRealtime: {
    backgroundColor: '#1f1319',
    borderColor: '#ef4444',
  },
  modeBtnActiveSim: {
    backgroundColor: '#102235',
    borderColor: '#0284c7',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748b',
    marginRight: 6,
  },
  modeBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  selectorBar: {
    flexDirection: 'row',
    backgroundColor: '#131924',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#242c38',
  },
  selectorTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 3,
    backgroundColor: '#1c2433',
  },
  selectorTabActive: {
    backgroundColor: '#0284c7',
  },
  selectorTabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  selectorTabTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  mainScroll: {
    flex: 1,
    backgroundColor: '#0c111c',
  },
  mainContent: {
    padding: 12,
    paddingBottom: 40,
  },
  phiCard: {
    backgroundColor: '#131924',
    borderRadius: 14,
    padding: 14,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: '#0284c7',
  },
  phiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  phiTitle: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  phiSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  phiBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phiBadgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  phiButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  phiBtn: {
    backgroundColor: '#242c38',
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
  bottomQuickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#242c38',
  },
  speedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginRight: 6,
  },
  speedPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#1c2433',
    borderRadius: 6,
    marginRight: 4,
  },
  speedPillActive: {
    backgroundColor: '#0284c7',
  },
  speedPillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  speedPillTextActive: {
    color: '#ffffff',
  },
  resetBtn: {
    backgroundColor: '#1c2433',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resetBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
});
