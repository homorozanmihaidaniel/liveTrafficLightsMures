import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import Svg, {
  Path,
  Rect,
  G,
  Text as SvgText,
  Polygon,
  Defs,
  ClipPath,
} from 'react-native-svg';

export default function IntersectionVisualizer({
  intersection,
  geometry,
  state,
  simTime = 0,
  onUpdatePhaseDuration,
  onUpdateYellowDuration,
  yellowDuration = 5,
}) {
  const activePhase = state?.activePhase;
  const signalState = state?.signalState || 'RED';
  const timeRemainingInState = state?.timeRemainingInState || 0;

  // STRICT doar VERDE, GALBEN sau ROȘU conform cerinței
  const currentActiveColor = useMemo(() => {
    if (signalState === 'YELLOW') return '#f59e0b'; // Galben
    if (signalState === 'GREEN') return '#22c55e';  // Verde
    return '#ef4444';                               // Roșu
  }, [signalState]);

  // Animația de flux continuu a vehiculelor de-a lungul curbelor (protejată împotriva NaN)
  const safeSimTime = typeof simTime === 'number' && !isNaN(simTime) ? simTime : 0;
  const flowDashOffset = -(safeSimTime * 80) % 36;
  const clipId = `roadClip_${intersection?.id || 'default'}`;

  if (!state || !activePhase || !geometry) {
    return null;
  }

  return (
    <View style={styles.card}>
      {/* Antet Intersecție Simplu & Clar */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{intersection.name}</Text>
          <View style={styles.coordRow}>
            <MapPin size={11} color="#94a3b8" style={{ marginRight: 4 }} />
            <Text style={styles.coordText}>{intersection.coordinates}</Text>
          </View>
        </View>

        {/* Semnal Rutier (DOAR Verde, Galben sau Roșu) */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                signalState === 'GREEN'
                  ? 'rgba(34, 197, 94, 0.16)'
                  : 'rgba(245, 158, 11, 0.2)',
              borderColor:
                signalState === 'GREEN' ? '#22c55e' : '#f59e0b',
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  signalState === 'GREEN' ? '#22c55e' : '#f59e0b',
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: signalState === 'GREEN' ? '#22c55e' : '#f59e0b' },
            ]}
          >
            {signalState === 'GREEN' ? 'VERDE' : 'GALBEN'}
          </Text>
          <Text style={styles.timerNumber}>
            {Math.ceil(timeRemainingInState)}s
          </Text>
        </View>
      </View>

      {/* Bară descriere fază activă */}
      <View
        style={[
          styles.phaseBar,
          { borderLeftColor: currentActiveColor },
        ]}
      >
        <View style={styles.phaseTitleRow}>
          <View style={[styles.phaseIndicatorDot, { backgroundColor: currentActiveColor }]} />
          <Text style={styles.phaseBarTitle}>{activePhase.name}</Text>
        </View>
        <Text style={styles.phaseBarDesc}>{activePhase.flowDescription}</Text>
      </View>

      {/* Harta Vizuală cu Mască de Tăiere (ClipPath) ce ține toate liniile STRICT în interiorul drumului */}
      <View style={styles.mapWrapper}>
        <Svg
          viewBox={geometry.viewBox || '0 0 1000 1000'}
          style={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          <Defs>
            {/* Mască de tăiere: Garantează că nicio linie de circulație nu poate ieși vreodată afară din drum! */}
            <ClipPath id={clipId}>
              <Path d={geometry.roadsOutline} />
            </ClipPath>
          </Defs>

          {/* Teren de fundal Google Maps Dark */}
          <Rect x="0" y="0" width="1000" height="1000" fill="#131924" />

          {/* Corpul de asfalt al drumului (borduri netede și rotunjite) */}
          <Path
            d={geometry.roadsOutline}
            fill="#242d3d"
            stroke="#3b485e"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* ============================================================== */}
          {/* TOATE LINIILE DE CIRCULAȚIE SUNT CLIPPATE PE SUPRAFAȚA DRUMULUI! */}
          {/* ============================================================== */}
          <G clipPath={`url(#${clipId})`}>
            {/* Marcaje de delimitare benzi */}
            {geometry.markings.map((m, idx) => (
              <Path
                key={`m_${idx}`}
                d={m.d}
                fill={m.fill || 'none'}
                stroke={m.stroke}
                strokeWidth={m.strokeWidth}
                strokeDasharray={m.dashed ? '12 10' : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* COLORAREA DRUMURILOR CARE AU VERDE SAU GALBEN */}
            {geometry.flows && geometry.flows.map((flow, flowIdx) => {
              const activeFlowIds = activePhase?.activeFlowIds || [];
              const isActive = activeFlowIds.includes(flow.id);

              if (!isActive) {
                // Drumurile oprite (ROȘU) au doar un contur discret de așteptare
                return (
                  <Path
                    key={`flow_inact_${flow.id}_${flowIdx}`}
                    d={flow.d}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={(flow.strokeWidth || 22) - 6}
                    strokeOpacity={0.05}
                    strokeLinecap="round"
                  />
                );
              }

              // DRUMUL CARE ARE VERDE SAU GALBEN SE COLOREAZĂ PUTERNIC:
              return (
                <G key={`flow_act_${flow.id}_${flowIdx}`}>
                  {/* 1. Halo luminos de fundal al carosabilului */}
                  <Path
                    d={flow.d}
                    fill="none"
                    stroke={currentActiveColor}
                    strokeWidth={(flow.strokeWidth || 22) + 10}
                    strokeOpacity={signalState === 'YELLOW' ? 0.35 : 0.28}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* 2. Corpul benzii deschise (Verde când circulă, Galben la schimbare) */}
                  <Path
                    d={flow.d}
                    fill="none"
                    stroke={currentActiveColor}
                    strokeWidth={flow.strokeWidth || 22}
                    strokeOpacity={signalState === 'YELLOW' ? 0.85 : 0.95}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* 3. "Cum circulă efectiv": Animație fluidă de vehicule/flux alb */}
                  <Path
                    d={flow.d}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={5}
                    strokeOpacity={signalState === 'YELLOW' ? 0.75 : 0.95}
                    strokeDasharray="16 20"
                    strokeDashoffset={flowDashOffset}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </G>
              );
            })}
          </G>

          {/* Insulele desenate cu hașuri de vopsea peste asfalt */}
          {geometry.islands &&
            geometry.islands.map((isl) => (
              <G key={isl.id}>
                {isl.path ? (
                  <Path
                    d={isl.path}
                    fill={isl.fill || '#131924'}
                    stroke={isl.stroke || '#cbd5e1'}
                    strokeWidth={isl.strokeWidth || 2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ) : (
                  <Polygon
                    points={isl.points}
                    fill={isl.fill || '#131924'}
                    stroke={isl.stroke || '#cbd5e1'}
                    strokeWidth={isl.strokeWidth || 2}
                    strokeLinejoin="round"
                  />
                )}
                {isl.hatchLines &&
                  isl.hatchLines.map((hl, hIdx) => (
                    <Path
                      key={`h_${isl.id}_${hIdx}`}
                      d={hl}
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ))}
              </G>
            ))}

          {/* Insulă triunghiulară dacă există */}
          {geometry.triangularIsland && (
            <G>
              {geometry.triangularIsland.path ? (
                <Path
                  d={geometry.triangularIsland.path}
                  fill={geometry.triangularIsland.fill || '#131924'}
                  stroke={geometry.triangularIsland.stroke || '#cbd5e1'}
                  strokeWidth={geometry.triangularIsland.strokeWidth || 2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : (
                <Polygon
                  points={geometry.triangularIsland.points}
                  fill={geometry.triangularIsland.fill || '#131924'}
                  stroke={geometry.triangularIsland.stroke || '#cbd5e1'}
                  strokeWidth={geometry.triangularIsland.strokeWidth || 2}
                  strokeLinejoin="round"
                />
              )}
              {geometry.triangularIsland.hatchLines &&
                geometry.triangularIsland.hatchLines.map((hl, hIdx) => (
                  <Path
                    key={`th_${hIdx}`}
                    d={hl}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ))}
            </G>
          )}

          {/* Parcare marcată "P" cu locuri de parcare oblice */}
          {geometry.parkingArea && (
            <G>
              <Polygon
                points={geometry.parkingArea.points}
                fill="#1a2332"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {geometry.parkingArea.stalls &&
                geometry.parkingArea.stalls.map((stl, sIdx) => (
                  <Path
                    key={`stl_${sIdx}`}
                    d={stl}
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                ))}
              <SvgText
                x={geometry.parkingArea.labelX}
                y={geometry.parkingArea.labelY}
                fill="#94a3b8"
                fontSize="32"
                fontWeight="bold"
                textAnchor="middle"
              >
                P
              </SvgText>
            </G>
          )}

          {/* Ansamblul Mănăstirii / Bisericii din fața străzii Papiu Ilarian */}
          {geometry.monasteryArea && (
            <G>
              <Polygon
                points={geometry.monasteryArea.points}
                fill="#16202e"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <G transform={`translate(${geometry.monasteryArea.labelX}, ${geometry.monasteryArea.labelY - 14})`}>
                <Path
                  d="M 0,-10 L 0,8 M -6,-3 L 6,-3"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
              <SvgText
                x={geometry.monasteryArea.labelX}
                y={geometry.monasteryArea.labelY + 18}
                fill="#cbd5e1"
                fontSize="17"
                fontWeight="bold"
                textAnchor="middle"
              >
                {geometry.monasteryArea.label}
              </SvgText>
              {geometry.monasteryArea.subLabel && (
                <SvgText
                  x={geometry.monasteryArea.labelX}
                  y={geometry.monasteryArea.labelY + 40}
                  fill="#94a3b8"
                  fontSize="13"
                  textAnchor="middle"
                >
                  {geometry.monasteryArea.subLabel}
                </SvgText>
              )}
            </G>
          )}

          {/* Săgețile direcționale pe asfalt */}
          {geometry.laneArrows.map((arrow, idx) => (
            <G
              key={`a_${idx}`}
              transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.rotation})`}
            >
              <Path
                d="M 0,-18 L -8,-5 L -3,-5 L -3,15 L 3,15 L 3,-5 L 8,-5 Z"
                fill="#ffffff"
                opacity="0.85"
              />
              {arrow.type.includes('left') && (
                <Path d="M -3,0 L -16,0 L -11,5 L -11,1 L -3,1 Z" fill="#ffffff" opacity="0.85" />
              )}
              {arrow.type.includes('right') && (
                <Path d="M 3,0 L 16,0 L 11,5 L 11,1 L 3,1 Z" fill="#ffffff" opacity="0.85" />
              )}
            </G>
          ))}

          {/* Treceri de pietoni (Zebre) și Linia de Stop STRICT pe benzile de intrare */}
          {geometry.crosswalks && geometry.crosswalks.map((cw) => {
            const isArmActive = activePhase?.activeBranches?.includes(cw.arm);
            return (
              <G key={`cw_${cw.id}`}>
                {cw.rects && cw.rects.map((r, rIdx) => {
                  const stripes = [];
                  const count = Math.floor(r.width / 18);
                  for (let i = 0; i < count; i++) {
                    stripes.push(
                      <Rect
                        key={`cw_s_${cw.id}_${rIdx}_${i}`}
                        x={r.x + i * 18}
                        y={r.y}
                        width={9}
                        height={r.height}
                        rx={2}
                        ry={2}
                        fill="#f8fafc"
                        opacity={0.9}
                        transform={
                          r.rotation
                            ? `rotate(${r.rotation}, ${r.x}, ${r.y})`
                            : undefined
                        }
                      />
                    );
                  }
                  return <G key={`cw_r_${cw.id}_${rIdx}`}>{stripes}</G>;
                })}

                {/* Linia de Stop: ROȘIE când brațul e oprit, VERDE/GALBEN când e deschis */}
                {cw.stopLine && (
                  <Path
                    d={cw.stopLine}
                    fill="none"
                    stroke={
                      isArmActive
                        ? signalState === 'GREEN'
                          ? '#22c55e'
                          : '#f59e0b'
                        : '#ef4444'
                    }
                    strokeWidth="5"
                    strokeOpacity={isArmActive ? '0.75' : '1'}
                    strokeLinecap="round"
                  />
                )}
              </G>
            );
          })}

          {/* Etichete Străzi Google Maps (poziționate în afara carosabilului) */}
          {intersection.id === 'int1' ? (
            <G>
              {/* Nord */}
              <Rect x="370" y="8" width="340" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="540" y="35" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Str. Bernády György (Nord)
              </SvgText>

              {/* Sud */}
              <Rect x="380" y="948" width="340" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="550" y="975" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Str. Al. Papiu Ilarian (Sud)
              </SvgText>

              {/* Est */}
              <Rect x="670" y="340" width="310" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="825" y="367" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Str. Nicolae Iorga (Est)
              </SvgText>

              {/* Vest */}
              <Rect x="15" y="100" width="330" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="180" y="127" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Str. Revoluției (Vest)
              </SvgText>
            </G>
          ) : (
            <G>
              {/* Nord */}
              <Rect x="340" y="8" width="340" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="510" y="35" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Parcare Trandafirilor (Nord)
              </SvgText>

              {/* Sud */}
              <Rect x="250" y="948" width="320" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="410" y="975" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Str. Revoluției (Sud)
              </SvgText>

              {/* Est */}
              <Rect x="660" y="110" width="325" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="822" y="137" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Piața Trandafirilor (Est)
              </SvgText>

              {/* Vest */}
              <Rect x="15" y="340" width="325" height="42" rx="10" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
              <SvgText x="177" y="367" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle">
                Piața Trandafirilor (Vest)
              </SvgText>
            </G>
          )}
        </Svg>
      </View>

      {/* ============================================================== */}
      {/* SCHIMBAREA TIMPIILOR DIRECT PE HARTĂ                          */}
      {/* ============================================================== */}
      <View style={styles.directControlsCard}>
        <View style={styles.directControlsHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={14} color="#38bdf8" style={{ marginRight: 6 }} />
            <Text style={styles.directControlsTitle}>
              Schimbă Timpii pe Direcții (Direct pe Hartă):
            </Text>
          </View>
          <Text style={styles.totalPeriodText}>
            Perioadă Totală T = {state.T}s
          </Text>
        </View>

        <View style={styles.timingPillsGrid}>
          {intersection.phases.map((ph, idx) => {
            const isPhaseActive = ph.id === activePhase.id;
            const branchState = isPhaseActive ? signalState : 'RED';
            const pillColor =
              branchState === 'GREEN'
                ? '#22c55e'
                : branchState === 'YELLOW'
                ? '#f59e0b'
                : '#ef4444';

            const currentSec = state.phaseDurations
              ? state.phaseDurations[idx]
              : ph.defaultGreenDuration;

            return (
              <View
                key={ph.id}
                style={[
                  styles.timingPill,
                  {
                    borderColor: pillColor,
                    backgroundColor: isPhaseActive
                      ? 'rgba(255,255,255,0.06)'
                      : '#1e293b',
                  },
                ]}
              >
                <View style={styles.pillTopRow}>
                  <View style={[styles.miniDot, { backgroundColor: pillColor }]} />
                  <Text style={styles.pillBranchName} numberOfLines={1}>
                    {ph.branchName}
                  </Text>
                  <Text style={[styles.pillStateLabel, { color: pillColor }]}>
                    {branchState === 'GREEN'
                      ? 'VERDE'
                      : branchState === 'YELLOW'
                      ? 'GALBEN'
                      : 'ROȘU'}
                  </Text>
                </View>

                <View style={styles.pillStepper}>
                  <TouchableOpacity
                    style={styles.pillMinusBtn}
                    onPress={() =>
                      onUpdatePhaseDuration(
                        intersection.id,
                        idx,
                        currentSec - 5
                      )
                    }
                  >
                    <Text style={styles.pillBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.pillSecondsText}>{currentSec}s</Text>

                  <TouchableOpacity
                    style={styles.pillPlusBtn}
                    onPress={() =>
                      onUpdatePhaseDuration(
                        intersection.id,
                        idx,
                        currentSec + 5
                      )
                    }
                  >
                    <Text style={styles.pillBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Timp Galben de Eliberare */}
        <View style={styles.yellowDirectRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.miniDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.yellowLabel}>Timp Galben (Tranziție):</Text>
          </View>
          <View style={styles.yellowStepper}>
            <TouchableOpacity
              style={styles.yellowBtn}
              onPress={() =>
                onUpdateYellowDuration(intersection.id, yellowDuration - 1)
              }
            >
              <Text style={styles.yellowBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.yellowSeconds}>{yellowDuration}s</Text>
            <TouchableOpacity
              style={styles.yellowBtn}
              onPress={() =>
                onUpdateYellowDuration(intersection.id, yellowDuration + 1)
              }
            >
              <Text style={styles.yellowBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131924',
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#242c38',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  coordText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 6,
  },
  timerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  phaseBar: {
    backgroundColor: '#1e2530',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  phaseIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  phaseBarTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
  },
  phaseBarDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
  },
  mapWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#131924',
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#242c38',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  directControlsCard: {
    backgroundColor: '#1a2230',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2c374d',
  },
  directControlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  directControlsTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
  },
  totalPeriodText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timingPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timingPill: {
    width: '48.5%',
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 8,
    marginBottom: 8,
  },
  pillTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  pillBranchName: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  pillStateLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  pillStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131924',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  pillMinusBtn: {
    backgroundColor: '#293344',
    width: 28,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillPlusBtn: {
    backgroundColor: '#293344',
    width: 28,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillBtnText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  pillSecondsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'center',
  },
  yellowDirectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#2c374d',
  },
  yellowLabel: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  yellowStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131924',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  yellowBtn: {
    backgroundColor: '#293344',
    width: 28,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yellowBtnText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  yellowSeconds: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'center',
  },
});
