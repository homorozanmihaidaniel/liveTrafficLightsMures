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
import {
  Camera,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Waves,
  Radio,
  Sliders,
  Waypoints,
  Activity,
} from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

      {/* Antet cu Pictograme Lucide & Material Community */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name="traffic-light"
              size={20}
              color="#38bdf8"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.appTitle}>Semafoare Tg. Mureș</Text>
            {isRealTime ? (
              <View style={styles.liveHeaderBadge}>
                <Radio size={10} color="#ef4444" style={{ marginRight: 4 }} />
                <Text style={styles.liveHeaderText}>LIVE</Text>
              </View>
            ) : (
              <View style={styles.simHeaderBadge}>
                <Sliders size={10} color="#38bdf8" style={{ marginRight: 4 }} />
                <Text style={styles.simHeaderText}>SIMULARE</Text>
              </View>
            )}
          </View>

          <View style={styles.subRow}>
            <Clock size={11} color="#38bdf8" style={{ marginRight: 4 }} />
            <Text style={styles.appSubtitle}>
              {isRealTime
                ? `${phoneTimeStr} • Secunda ${currentCycleSec}s / ${currentT}s`
                : `Timp Simulat: ${Math.floor(simTime)}s • Viteză ${speedMultiplier}x`}
            </Text>
          </View>
        </View>

        {/* Butoane Header (Schiță & Play/Pause în Simulare) */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.sketchBtn}
            onPress={() => setSketchModalVisible(true)}
          >
            <Camera size={13} color="#38bdf8" style={{ marginRight: 5 }} />
            <Text style={styles.sketchBtnText}>Schiță</Text>
          </TouchableOpacity>

          {!isRealTime && (
            <TouchableOpacity
              style={[
                styles.playBtn,
                isRunning ? styles.playBtnActive : styles.pauseBtnActive,
              ]}
              onPress={togglePlayPause}
            >
              {isRunning ? (
                <Pause size={15} color="#ffffff" fill="#ffffff" />
              ) : (
                <Play size={15} color="#ffffff" fill="#ffffff" style={{ marginLeft: 2 }} />
              )}
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
          <Radio size={13} color={isRealTime ? '#ef4444' : '#64748b'} style={{ marginRight: 6 }} />
          <Text
            style={[
              styles.modeBtnText,
              isRealTime && styles.modeBtnTextActive,
            ]}
          >
            Timp Real (Ceas Telefon)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeBtn,
            !isRealTime && styles.modeBtnActiveSim,
          ]}
          onPress={() => setClockMode('simulated')}
        >
          <Sliders size={13} color={!isRealTime ? '#38bdf8' : '#64748b'} style={{ marginRight: 6 }} />
          <Text
            style={[
              styles.modeBtnText,
              !isRealTime && styles.modeBtnTextActive,
            ]}
          >
            Mod Simulare
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
          <Waypoints
            size={13}
            color={selectedIntersection === 'int1' ? '#ffffff' : '#94a3b8'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.selectorTabText,
              selectedIntersection === 'int1' && styles.selectorTabTextActive,
            ]}
          >
            Intersecția 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorTab,
            selectedIntersection === 'int2' && styles.selectorTabActive,
          ]}
          onPress={() => setSelectedIntersection('int2')}
        >
          <Waypoints
            size={13}
            color={selectedIntersection === 'int2' ? '#ffffff' : '#94a3b8'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.selectorTabText,
              selectedIntersection === 'int2' && styles.selectorTabTextActive,
            ]}
          >
            Intersecția 2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorTab,
            selectedIntersection === 'coordinated' && styles.selectorTabActive,
          ]}
          onPress={() => setSelectedIntersection('coordinated')}
        >
          <Waves
            size={13}
            color={selectedIntersection === 'coordinated' ? '#ffffff' : '#94a3b8'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.selectorTabText,
              selectedIntersection === 'coordinated' && styles.selectorTabTextActive,
            ]}
          >
            Undă Verde (φ)
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
              />
            )}

            {/* Secțiune Reglare Decalaj Fi direct sub hartă */}
            <View style={styles.phiCard}>
              <View style={styles.phiHeader}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Sliders size={14} color="#38bdf8" style={{ marginRight: 6 }} />
                    <Text style={styles.phiTitle}>Reglare Decalaj de Fază φ (Fi):</Text>
                  </View>
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
                    <Activity size={12} color="#38bdf8" style={{ marginRight: 4 }} />
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
                  <RotateCcw size={12} color="#cbd5e1" style={{ marginRight: 5 }} />
                  <Text style={styles.resetBtnText}>Reset Schiță</Text>
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
              />
            )}

            {/* Secțiune Reglare Decalaj Fi direct sub hartă */}
            <View style={styles.phiCard}>
              <View style={styles.phiHeader}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Sliders size={14} color="#38bdf8" style={{ marginRight: 6 }} />
                    <Text style={styles.phiTitle}>Reglare Decalaj de Fază φ (Fi):</Text>
                  </View>
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
                    <Activity size={12} color="#38bdf8" style={{ marginRight: 4 }} />
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
                  <RotateCcw size={12} color="#cbd5e1" style={{ marginRight: 5 }} />
                  <Text style={styles.resetBtnText}>Reset Schiță</Text>
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
  liveHeaderText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  simHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sketchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 3,
    backgroundColor: '#1c2433',
  },
  selectorTabActive: {
    backgroundColor: '#0284c7',
  },
  selectorTabText: {
    color: '#94a3b8',
    fontSize: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
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
