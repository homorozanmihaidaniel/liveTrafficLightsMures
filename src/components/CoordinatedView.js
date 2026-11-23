import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle, G, Text as SvgText, Line } from 'react-native-svg';
import { Waves, Clock, CheckCircle2, AlertTriangle, Waypoints } from 'lucide-react-native';
import { formatMinutesSeconds } from '../utils/formatters';
import IntersectionVisualizer from './IntersectionVisualizer';
import { INTERSECTIONS } from '../data/intersections';
import { INT1_GEOMETRY } from '../data/intersection1Geometry';
import { INT2_GEOMETRY } from '../data/intersection2Geometry';

export default function CoordinatedView({ sim }) {
  const {
    simTime,
    phi,
    minPhi,
    maxPhi,
    setPhi,
    T1,
    T2,
    int1State,
    int2State,
    isRealTime,
    phoneTimeStr,
  } = sim;

  // Calculăm progresul unui pluton de vehicule pe coridorul de 400m dintre cele două intersecții
  // Viteza medie în oraș: 50 km/h = 13.8 m/s => Timp de tranzit ~ 29 secunde
  const corridorTransitTime = 29; // secunde pentru parcurgerea celor 400m

  // Verificăm dacă faza de tranzit coincide cu faza verde la sosirea în Intersecția 2
  const isGreenWaveAchieved =
    int2State.signalState === 'GREEN' &&
    (int2State.activePhase.id === 1 || int2State.activePhase.id === 3);

  // Procentaj deplasare vehicule pe coridor (0 la 100%)
  const corridorProgress = ((simTime % corridorTransitTime) / corridorTransitTime) * 100;
  const carX = 60 + (corridorProgress / 100) * 360; // coordonată X SVG

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Banner explicativ Coordonare & Parametru Fi */}
      <View style={styles.summaryCard}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Waves size={18} color="#38bdf8" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Undă Verde (φ)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {isRealTime && (
              <View style={styles.liveBadge}>
                <Clock size={11} color="#38bdf8" style={{ marginRight: 4 }} />
                <Text style={styles.liveBadgeText}>{phoneTimeStr}</Text>
              </View>
            )}
            <View style={styles.distBadge}>
              <Text style={styles.distBadgeText}>~400 m</Text>
            </View>
          </View>
        </View>

        <Text style={styles.corridorDescription}>
          Coridorul <Text style={{ fontWeight: 'bold', color: '#f8fafc' }}>Piața Trandafirilor ↔ Str. Nicolae Iorga</Text> leagă cele două intersecții.
          Parametrul <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>φ = {phi > 0 ? `+${phi}s` : `${phi}s`}</Text> modifică defazajul temporal în intervalul [-T/2, +T/2] = [{minPhi}s, +{maxPhi}s].
        </Text>

        {/* Feedback în timp real privind Unda Verde */}
        <View
          style={[
            styles.waveStatusBox,
            {
              backgroundColor: isGreenWaveAchieved
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
              borderColor: isGreenWaveAchieved ? '#10b981' : '#ef4444',
            },
          ]}
        >
          {isGreenWaveAchieved ? (
            <CheckCircle2 size={24} color="#10b981" />
          ) : (
            <AlertTriangle size={24} color="#ef4444" />
          )}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={[
                styles.waveStatusTitle,
                { color: isGreenWaveAchieved ? '#10b981' : '#f87171' },
              ]}
            >
              {isGreenWaveAchieved
                ? 'UNDĂ VERDE ACTIVĂ PE CORIDOR'
                : 'DECALAJ NEOPTIMAL (OPRIRE PE ROȘU)'}
            </Text>
            <Text style={styles.waveStatusSub}>
              {isGreenWaveAchieved
                ? 'Plutonul de vehicule trece fără oprire dintr-o intersecție în cealaltă.'
                : 'Ajustează glisorul φ pentru a sincroniza sosirea cu faza verde.'}
            </Text>
          </View>
        </View>

        {/* Reprezentare schematică a coridorului rutier de 400m */}
        <View style={styles.corridorSvgContainer}>
          <Svg viewBox="0 0 500 120" style={styles.corridorSvg}>
            {/* Fundal coridor */}
            <Rect x="0" y="0" width="500" height="120" fill="#0f172a" rx="10" />

            {/* Bulevardul asfaltat de legătură */}
            <Rect x="40" y="42" width="420" height="36" fill="#334155" stroke="#475569" strokeWidth="2" rx="4" />
            <Line x1="40" y1="60" x2="460" y2="60" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />

            {/* Nod Intersecția 2 (Vest) */}
            <G transform="translate(60, 60)">
              <Circle
                r="22"
                fill="#1e293b"
                stroke={
                  int2State.signalState === 'GREEN'
                    ? '#10b981'
                    : int2State.signalState === 'YELLOW'
                    ? '#f59e0b'
                    : '#ef4444'
                }
                strokeWidth="3"
              />
              <SvgText x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                INT 2
              </SvgText>
              <SvgText x="0" y="36" fill="#94a3b8" fontSize="9" textAnchor="middle">
                Trandafirilor
              </SvgText>
            </G>

            {/* Nod Intersecția 1 (Est) */}
            <G transform="translate(440, 60)">
              <Circle
                r="22"
                fill="#1e293b"
                stroke={
                  int1State.signalState === 'GREEN'
                    ? '#10b981'
                    : int1State.signalState === 'YELLOW'
                    ? '#f59e0b'
                    : '#ef4444'
                }
                strokeWidth="3"
              />
              <SvgText x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                INT 1
              </SvgText>
              <SvgText x="0" y="36" fill="#94a3b8" fontSize="9" textAnchor="middle">
                Papiu / Iorga
              </SvgText>
            </G>

            {/* Vehicule în mișcare pe coridor */}
            <G transform={`translate(${carX}, 52)`}>
              <Rect x="-12" y="-6" width="24" height="12" rx="3" fill="#22c55e" stroke="#ffffff" strokeWidth="1" />
              <Circle cx="8" cy="-6" r="1.5" fill="#fef08a" />
              <Circle cx="8" cy="6" r="1.5" fill="#fef08a" />
            </G>
            <G transform={`translate(${((carX + 180) % 400) + 40}, 68)`}>
              <Rect x="-12" y="-6" width="24" height="12" rx="3" fill="#22c55e" stroke="#ffffff" strokeWidth="1" />
              <Circle cx="-8" cy="-6" r="1.5" fill="#fef08a" />
              <Circle cx="-8" cy="6" r="1.5" fill="#fef08a" />
            </G>

            {/* Cota distanță 400m */}
            <Line x1="100" y1="18" x2="400" y2="18" stroke="#64748b" strokeWidth="1" />
            <SvgText x="250" y="15" fill="#94a3b8" fontSize="11" textAnchor="middle">
              400 metri (Tranzit ~ 29 sec la 50 km/h)
            </SvgText>
          </Svg>
        </View>

        {/* Glisor rapid reglare Fi direct în această pagină */}
        <View style={styles.quickPhiControls}>
          <Text style={styles.quickPhiTitle}>Reglare Rapidă Decalaj φ:</Text>
          <View style={styles.quickPhiRow}>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => setPhi(phi - 10)}
            >
              <Text style={styles.qBtnText}>-10s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => setPhi(phi - 2)}
            >
              <Text style={styles.qBtnText}>-2s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.qBtn, styles.qResetBtn]}
              onPress={() => setPhi(0)}
            >
              <Text style={styles.qBtnText}>φ = 0s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => setPhi(phi + 2)}
            >
              <Text style={styles.qBtnText}>+2s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => setPhi(phi + 10)}
            >
              <Text style={styles.qBtnText}>+10s</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cele două intersecții rulate simultan */}
      <View style={styles.sectionHeaderRow}>
        <Waypoints size={16} color="#38bdf8" style={{ marginRight: 6 }} />
        <Text style={styles.sectionHeader}>
          Intersecția 1 (Referință: t = {Math.round(simTime % T1)}s • T₁ = {formatMinutesSeconds(T1)})
        </Text>
      </View>
      <IntersectionVisualizer
        intersection={INTERSECTIONS[0]}
        geometry={INT1_GEOMETRY}
        state={int1State}
        simTime={simTime}
        yellowDuration={sim.int1Yellow}
        onUpdatePhaseDuration={sim.updatePhaseDuration}
        onUpdateYellowDuration={sim.updateYellowDuration}
      />

      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
        <Waypoints size={16} color="#38bdf8" style={{ marginRight: 6 }} />
        <Text style={styles.sectionHeader}>
          Intersecția 2 (Decalată cu φ: t₂ = {Math.round((simTime + phi) % T2)}s • T₂ = {formatMinutesSeconds(T2)})
        </Text>
      </View>
      <IntersectionVisualizer
        intersection={INTERSECTIONS[1]}
        geometry={INT2_GEOMETRY}
        state={int2State}
        simTime={simTime + phi}
        yellowDuration={sim.int2Yellow}
        onUpdatePhaseDuration={sim.updatePhaseDuration}
        onUpdateYellowDuration={sim.updateYellowDuration}
      />
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
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  distBadge: {
    backgroundColor: '#0369a1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  corridorDescription: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  waveStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  waveStatusIcon: {
    fontSize: 22,
  },
  waveStatusTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  waveStatusSub: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
  corridorSvgContainer: {
    width: '100%',
    height: 120,
    marginBottom: 14,
  },
  corridorSvg: {
    width: '100%',
    height: '100%',
  },
  quickPhiControls: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
  },
  quickPhiTitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  quickPhiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qBtn: {
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  qResetBtn: {
    backgroundColor: '#0284c7',
  },
  qBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  liveBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  liveBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
