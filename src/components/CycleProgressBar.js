import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Timer } from 'lucide-react-native';
import { formatMinSecShort } from '../utils/formatters';

export default function CycleProgressBar({
  intersection,
  state,
  yellowDuration = 5,
}) {
  if (!intersection || !state) return null;

  const phases = intersection.phases || [];
  const phaseDurations =
    state.phaseDurations || phases.map((p) => p.defaultGreenDuration);
  const currentYellow = state.yellowDuration ?? yellowDuration ?? 5;
  const yellowOnlyDur =
    state.yellowOnlyDuration ?? (currentYellow >= 4 ? 3 : Math.max(1, Math.floor(currentYellow / 2)));
  const allRedDur =
    state.allRedDuration ?? Math.max(0, currentYellow - yellowOnlyDur);

  const T =
    state.T ||
    phaseDurations.reduce((acc, curr) => acc + curr + currentYellow, 0) ||
    1;

  const currentCycleTime = state.currentCycleTime ?? 0;
  const activePhaseIndex = state.activePhaseIndex ?? 0;
  const signalState = state.signalState || 'GREEN';
  const timeRemainingInState = state.timeRemainingInState ?? 0;

  // Calculăm segmentele fiecărei faze (Verde, Galben și Punct Mort / Toate Roșii)
  let accumulated = 0;
  const timelinePhases = phases.map((phase, idx) => {
    const greenDur = phaseDurations[idx] ?? phase.defaultGreenDuration;
    const phaseTotal = greenDur + currentYellow;

    const phaseStart = accumulated;
    const greenEnd = phaseStart + greenDur;
    const yellowEnd = greenEnd + yellowOnlyDur;
    const phaseEnd = phaseStart + phaseTotal;

    const isCurrentPhase = activePhaseIndex === idx;
    const isGreenActive = isCurrentPhase && signalState === 'GREEN';
    const isYellowActive = isCurrentPhase && signalState === 'YELLOW';
    const isAllRedActive = isCurrentPhase && signalState === 'ALL_RED';

    accumulated = phaseEnd;

    return {
      ...phase,
      phaseIndex: idx,
      greenDuration: greenDur,
      yellowOnlyDuration: yellowOnlyDur,
      allRedDuration: allRedDur,
      phaseTotal,
      phaseStart,
      greenEnd,
      yellowEnd,
      phaseEnd,
      greenWidthPercent: (greenDur / T) * 100,
      yellowWidthPercent: (yellowOnlyDur / T) * 100,
      allRedWidthPercent: (allRedDur / T) * 100,
      isCurrentPhase,
      isGreenActive,
      isYellowActive,
      isAllRedActive,
    };
  });

  const cursorPercent = Math.min(100, Math.max(0, (currentCycleTime / T) * 100));

  return (
    <View style={styles.card}>
      {/* 1. Header: Titlu, secundă în ciclu și badge fază activă (inclusiv PUNCT MORT) */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Timer size={14} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.title}>
            Ciclu Mare: <Text style={styles.titleSec}>{Math.floor(currentCycleTime)}s</Text> / {Math.round(T)}s
          </Text>
          <View style={styles.cycleTotalBadge}>
            <Text style={styles.cycleTotalBadgeText}>{formatMinSecShort(T)}</Text>
          </View>
        </View>

        {/* Badge stare activă (Verde, Galben sau Punct Mort) */}
        <View
          style={[
            styles.stateBadge,
            signalState === 'GREEN'
              ? styles.stateBadgeGreen
              : signalState === 'YELLOW'
              ? styles.stateBadgeYellow
              : styles.stateBadgeAllRed,
          ]}
        >
          <View
            style={[
              styles.stateDot,
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
              styles.stateBadgeText,
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
              ? `Faza ${activePhaseIndex + 1}: VERDE (${Math.ceil(timeRemainingInState)}s)`
              : signalState === 'YELLOW'
              ? `Faza ${activePhaseIndex + 1}: GALBEN (${Math.ceil(timeRemainingInState)}s)`
              : `PUNCT MORT: TOATE ROȘII (${Math.ceil(timeRemainingInState)}s)`}
          </Text>
        </View>
      </View>

      {/* 2. Bara vizuală a ciclului mare (cu VERDE, GALBEN și PUNCT MORT / ROȘU) */}
      <View style={styles.barWrapper}>
        <View style={styles.barTrack}>
          {timelinePhases.map((phase) => (
            <React.Fragment key={`phase_seg_${phase.id}`}>
              {/* Segment Verde */}
              <View
                style={[
                  styles.segmentGreen,
                  { width: `${phase.greenWidthPercent}%` },
                  phase.isGreenActive && styles.segmentGreenActive,
                ]}
              >
                {phase.greenWidthPercent > 14 && (
                  <Text
                    style={[
                      styles.segmentTextGreen,
                      phase.isGreenActive && styles.segmentTextGreenActive,
                    ]}
                    numberOfLines={1}
                  >
                    F{phase.id} ({phase.greenDuration}s)
                  </Text>
                )}
              </View>

              {/* Segment Galben (3s) */}
              <View
                style={[
                  styles.segmentYellow,
                  { width: `${phase.yellowWidthPercent}%` },
                  phase.isYellowActive && styles.segmentYellowActive,
                ]}
              >
                {phase.yellowWidthPercent > 4.5 && (
                  <Text
                    style={[
                      styles.segmentTextYellow,
                      phase.isYellowActive && styles.segmentTextYellowActive,
                    ]}
                    numberOfLines={1}
                  >
                    G
                  </Text>
                )}
              </View>

              {/* Segment Punct Mort / Roșu General (2s) */}
              <View
                style={[
                  styles.segmentAllRed,
                  { width: `${phase.allRedWidthPercent}%` },
                  phase.isAllRedActive && styles.segmentAllRedActive,
                ]}
              >
                {phase.allRedWidthPercent > 4.5 && (
                  <Text
                    style={[
                      styles.segmentTextAllRed,
                      phase.isAllRedActive && styles.segmentTextAllRedActive,
                    ]}
                    numberOfLines={1}
                  >
                    PM
                  </Text>
                )}
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Cursor/Indicator de poziție în timp real în ciclul mare */}
        <View
          style={[
            styles.cursor,
            { left: `${cursorPercent}%` },
          ]}
          pointerEvents="none"
        >
          <View style={styles.cursorPinTop} />
          <View style={styles.cursorStem} />
          <View style={styles.cursorPinBottom} />
        </View>
      </View>

      {/* 3. Marcatori faze (Chips) sub bară cu intervalele în secunde */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.phaseChipsRow}
      >
        {timelinePhases.map((phase) => {
          const isActive = phase.isCurrentPhase;
          const isYellow = phase.isYellowActive;
          const isAllRed = phase.isAllRedActive;

          return (
            <View
              key={`chip_${phase.id}`}
              style={[
                styles.phaseChip,
                isActive &&
                  (isAllRed
                    ? styles.phaseChipActiveAllRed
                    : isYellow
                    ? styles.phaseChipActiveYellow
                    : styles.phaseChipActiveGreen),
              ]}
            >
              <View style={styles.chipTopRow}>
                <View
                  style={[
                    styles.chipDot,
                    {
                      backgroundColor: isActive
                        ? isAllRed
                          ? '#ef4444'
                          : isYellow
                          ? '#f59e0b'
                          : '#22c55e'
                        : '#64748b',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.chipPhaseName,
                    isActive &&
                      (isAllRed
                        ? styles.chipTextAllRed
                        : isYellow
                        ? styles.chipTextYellow
                        : styles.chipTextGreen),
                  ]}
                  numberOfLines={1}
                >
                  F{phase.id}: {phase.branchName}
                </Text>
              </View>

              <View style={styles.chipBottomRow}>
                <Text style={styles.chipTiming}>
                  {phase.greenDuration}s V + {phase.yellowOnlyDuration}s G + {phase.allRedDuration}s PM
                </Text>
                <Text style={styles.chipRange}>
                  {phase.phaseStart}s–{phase.phaseEnd}s
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 10,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  titleSec: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  cycleTotalBadge: {
    marginLeft: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cycleTotalBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  stateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stateBadgeGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: '#22c55e',
  },
  stateBadgeYellow: {
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderColor: '#f59e0b',
  },
  stateBadgeAllRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.16)',
    borderColor: '#ef4444',
  },
  stateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  stateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Bara vizuală */
  barWrapper: {
    position: 'relative',
    height: 28,
    marginVertical: 4,
    justifyContent: 'center',
  },
  barTrack: {
    height: 24,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#0a0f1d',
    borderWidth: 1,
    borderColor: '#334155',
  },
  segmentGreen: {
    height: '100%',
    backgroundColor: '#064e3b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#0f172a',
  },
  segmentGreenActive: {
    backgroundColor: '#22c55e',
  },
  segmentTextGreen: {
    fontSize: 10,
    fontWeight: '700',
    color: '#86efac',
    paddingHorizontal: 2,
  },
  segmentTextGreenActive: {
    color: '#022c22',
  },
  segmentYellow: {
    height: '100%',
    backgroundColor: '#78350f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#0f172a',
  },
  segmentYellowActive: {
    backgroundColor: '#f59e0b',
  },
  segmentTextYellow: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fde68a',
  },
  segmentTextYellowActive: {
    color: '#451a03',
  },
  segmentAllRed: {
    height: '100%',
    backgroundColor: '#450a0a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#0f172a',
  },
  segmentAllRedActive: {
    backgroundColor: '#ef4444',
  },
  segmentTextAllRed: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fca5a5',
  },
  segmentTextAllRedActive: {
    color: '#ffffff',
  },

  /* Cursorul poziție curentă */
  cursor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    marginLeft: -1,
    alignItems: 'center',
    zIndex: 10,
  },
  cursorPinTop: {
    width: 6,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  cursorStem: {
    width: 2,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cursorPinBottom: {
    width: 6,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },

  /* Marcatori faze (Chips) */
  phaseChipsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 6,
  },
  phaseChip: {
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 110,
  },
  phaseChipActiveGreen: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  phaseChipActiveYellow: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  phaseChipActiveAllRed: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
  },
  chipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  chipPhaseName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  chipTextGreen: {
    color: '#22c55e',
  },
  chipTextYellow: {
    color: '#f59e0b',
  },
  chipTextAllRed: {
    color: '#ef4444',
  },
  chipBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  chipTiming: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '600',
  },
  chipRange: {
    fontSize: 9,
    color: '#64748b',
  },
});
