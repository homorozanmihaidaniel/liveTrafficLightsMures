import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppState } from 'react-native';
import { INTERSECTIONS } from '../data/intersections';
import { Storage } from '../utils/storage';

const getMidnightTodayMs = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function useTrafficSimulation() {
  // Mod funcționare ceas: 'realtime' (ceasul telefonului / Live) sau 'simulated' (manual)
  const [clockMode, setClockModeState] = useState('realtime');

  // Timpul afișat al telefonului (format HH:mm:ss)
  const [phoneTimeStr, setPhoneTimeStr] = useState(() =>
    new Date().toLocaleTimeString('ro-RO', { hour12: false })
  );

  // Stare simulare (redare/pauză, viteză în mod manual)
  const [isRunning, setIsRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Timp simulat manual (folosit doar în clockMode === 'simulated')
  const [manualSimTime, setManualSimTime] = useState(0);

  // Timp live calculat din ceasul telefonului (secunde scurse de la ancoră)
  const [liveSecInt1, setLiveSecInt1] = useState(() => (Date.now() - getMidnightTodayMs()) / 1000);
  const [liveSecInt2, setLiveSecInt2] = useState(() => (Date.now() - getMidnightTodayMs()) / 1000);

  // Puncte de ancoră (timestamp în ms) pentru sincronizarea cu semafoarele reale
  const [anchorInt1, setAnchorInt1] = useState(getMidnightTodayMs);
  const [anchorInt2, setAnchorInt2] = useState(getMidnightTodayMs);

  // Istoric calibrare (ultima sincronizare efectuată de utilizator)
  const [lastCalibTimeInt1, setLastCalibTimeInt1] = useState(null);
  const [lastCalibTimeInt2, setLastCalibTimeInt2] = useState(null);

  // Mod colorare: 'sketch' sau 'traffic'
  const [colorMode, setColorMode] = useState('traffic');

  // Timpi configurabili pentru Intersecția 1
  const [int1Phases, setInt1Phases] = useState(
    INTERSECTIONS[0].phases.map((p) => p.defaultGreenDuration)
  );
  const [int1Yellow, setInt1Yellow] = useState(INTERSECTIONS[0].defaultYellowDuration);

  // Timpi configurabili pentru Intersecția 2
  const [int2Phases, setInt2Phases] = useState(
    INTERSECTIONS[1].phases.map((p) => p.defaultGreenDuration)
  );
  const [int2Yellow, setInt2Yellow] = useState(INTERSECTIONS[1].defaultYellowDuration);

  // Perioade totale T1 și T2
  const T1 = useMemo(() => {
    return int1Phases.reduce((acc, curr) => acc + curr + int1Yellow, 0);
  }, [int1Phases, int1Yellow]);

  const T2 = useMemo(() => {
    return int2Phases.reduce((acc, curr) => acc + curr + int2Yellow, 0);
  }, [int2Phases, int2Yellow]);

  const T_ref = T1;

  // Decalajul de fază phi (fi) în intervalul [-T/2, T/2]
  const [phi, setPhiState] = useState(0);

  const minPhi = -Math.round(T_ref / 2);
  const maxPhi = Math.round(T_ref / 2);

  const setPhi = useCallback(
    (newPhi) => {
      const clamped = Math.max(minPhi, Math.min(maxPhi, Math.round(newPhi)));
      setPhiState(clamped);
      Storage.setItem(Storage.KEYS.PHI, clamped);

      // În mod realtime, ajustarea lui phi decalează ancora Intersecției 2
      setAnchorInt2((currentA1) => {
        const newA2 = currentA1 - clamped * 1000;
        Storage.setItem(Storage.KEYS.ANCHOR_INT2, newA2);
        return newA2;
      });
    },
    [minPhi, maxPhi]
  );

  // 1. Încărcare setări salvate din AsyncStorage la pornire
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [
          savedMode,
          savedA1,
          savedA2,
          savedPhi,
          savedCalib1,
          savedCalib2,
          savedPhases1,
          savedPhases2,
          savedY1,
          savedY2,
        ] = await Promise.all([
          Storage.getItem(Storage.KEYS.CLOCK_MODE, 'realtime'),
          Storage.getItem(Storage.KEYS.ANCHOR_INT1, null),
          Storage.getItem(Storage.KEYS.ANCHOR_INT2, null),
          Storage.getItem(Storage.KEYS.PHI, null),
          Storage.getItem(Storage.KEYS.LAST_CALIB_TIME_INT1, null),
          Storage.getItem(Storage.KEYS.LAST_CALIB_TIME_INT2, null),
          Storage.getItem(Storage.KEYS.INT1_PHASES, null),
          Storage.getItem(Storage.KEYS.INT2_PHASES, null),
          Storage.getItem(Storage.KEYS.INT1_YELLOW, null),
          Storage.getItem(Storage.KEYS.INT2_YELLOW, null),
        ]);

        if (!isMounted) return;

        if (savedMode) setClockModeState(savedMode);
        if (savedPhi !== null) setPhiState(savedPhi);
        if (savedCalib1) setLastCalibTimeInt1(savedCalib1);
        if (savedCalib2) setLastCalibTimeInt2(savedCalib2);

        const midnight = getMidnightTodayMs();
        const a1 = savedA1 !== null ? savedA1 : midnight;
        const a2 = savedA2 !== null ? savedA2 : midnight - (savedPhi || 0) * 1000;
        setAnchorInt1(a1);
        setAnchorInt2(a2);

        if (Array.isArray(savedPhases1)) setInt1Phases(savedPhases1);
        if (Array.isArray(savedPhases2)) setInt2Phases(savedPhases2);
        if (typeof savedY1 === 'number') setInt1Yellow(savedY1);
        if (typeof savedY2 === 'number') setInt2Yellow(savedY2);

        // Actualizare imediată timpi la deschiderea aplicației
        const now = Date.now();
        setLiveSecInt1((now - a1) / 1000);
        setLiveSecInt2((now - a2) / 1000);
        setPhoneTimeStr(new Date(now).toLocaleTimeString('ro-RO', { hour12: false }));
      } catch (err) {
        console.warn('Eroare la încărcarea setărilor:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Schimbare mod ceas (Live vs Simulare)
  const setClockMode = useCallback((mode) => {
    setClockModeState(mode);
    Storage.setItem(Storage.KEYS.CLOCK_MODE, mode);
    if (mode === 'simulated') {
      // Inițializăm timpul de simulare cu timpul curent din Live
      setManualSimTime(liveSecInt1);
    }
  }, [liveSecInt1]);

  // Actualizare instantanee a timpului live (folosit și la revenirea din background)
  const updateRealTimes = useCallback(() => {
    const now = Date.now();
    setLiveSecInt1((now - anchorInt1) / 1000);
    setLiveSecInt2((now - anchorInt2) / 1000);
    setPhoneTimeStr(new Date(now).toLocaleTimeString('ro-RO', { hour12: false }));
  }, [anchorInt1, anchorInt2]);

  // Ascultare evenimente de ciclu de viață aplicație (revenire din background/sleep)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // La redeschiderea aplicației, recalculăm instantaneu după ceasul telefonului
        updateRealTimes();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [updateRealTimes]);

  // Loop de actualizare precis
  const lastTimestampRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (clockMode === 'realtime') {
      // În mod Realtime: ceasul telefonului (Date.now()) dictează starea la fiecare cadru
      const onTick = () => {
        const now = Date.now();
        setLiveSecInt1((now - anchorInt1) / 1000);
        setLiveSecInt2((now - anchorInt2) / 1000);
        setPhoneTimeStr(new Date(now).toLocaleTimeString('ro-RO', { hour12: false }));
        animFrameRef.current = requestAnimationFrame(onTick);
      };

      animFrameRef.current = requestAnimationFrame(onTick);
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    } else {
      // În mod Simulare: avansăm timpul manual
      if (!isRunning) {
        lastTimestampRef.current = null;
        return;
      }

      const onFrame = (timestamp) => {
        if (lastTimestampRef.current !== null) {
          const deltaMs = timestamp - lastTimestampRef.current;
          const deltaSec = (deltaMs / 1000) * speedMultiplier;
          setManualSimTime((prev) => prev + deltaSec);
        }
        lastTimestampRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(onFrame);
      };

      animFrameRef.current = requestAnimationFrame(onFrame);
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }
  }, [clockMode, isRunning, speedMultiplier, anchorInt1, anchorInt2]);

  // Timpul efectiv activ pentru Intersecția 1 și Intersecția 2
  const activeTimeInt1 = clockMode === 'realtime' ? liveSecInt1 : manualSimTime;
  const activeTimeInt2 =
    clockMode === 'realtime' ? liveSecInt2 : manualSimTime + phi;

  // Calibrare în timp real la fața locului (când semaforul fizic trece pe verde)
  const calibratePhaseNow = useCallback(
    (intId, phaseIndex = 0) => {
      const now = Date.now();
      const phases = intId === 'int1' ? int1Phases : int2Phases;
      const yellow = intId === 'int1' ? int1Yellow : int2Yellow;

      // Calculăm secunda de start a fazei alese în interiorul ciclului [0, T)
      let phaseStartSec = 0;
      for (let i = 0; i < phaseIndex; i++) {
        phaseStartSec += phases[i] + yellow;
      }

      // Noua ancoră astfel încât la momentul 'now', (now - anchor) % T === phaseStartSec
      const newAnchor = now - phaseStartSec * 1000;
      const nowStr = new Date(now).toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (intId === 'int1') {
        setAnchorInt1(newAnchor);
        setLastCalibTimeInt1(nowStr);
        Storage.setItem(Storage.KEYS.ANCHOR_INT1, newAnchor);
        Storage.setItem(Storage.KEYS.LAST_CALIB_TIME_INT1, nowStr);
      } else {
        setAnchorInt2(newAnchor);
        setLastCalibTimeInt2(nowStr);
        Storage.setItem(Storage.KEYS.ANCHOR_INT2, newAnchor);
        Storage.setItem(Storage.KEYS.LAST_CALIB_TIME_INT2, nowStr);
      }

      // Forțăm actualizarea imediată
      if (intId === 'int1') {
        setLiveSecInt1((now - newAnchor) / 1000);
      } else {
        setLiveSecInt2((now - newAnchor) / 1000);
      }
    },
    [int1Phases, int1Yellow, int2Phases, int2Yellow]
  );

  // Reglaj fin (+/- secunde în caz că butonul a fost apăsat mai devreme/mai târziu)
  const fineTuneOffset = useCallback((intId, deltaSec) => {
    // deltaSec > 0 înseamnă avansăm timpul (scădem ancora)
    const shiftMs = deltaSec * 1000;
    if (intId === 'int1') {
      setAnchorInt1((prev) => {
        const next = prev - shiftMs;
        Storage.setItem(Storage.KEYS.ANCHOR_INT1, next);
        return next;
      });
    } else {
      setAnchorInt2((prev) => {
        const next = prev - shiftMs;
        Storage.setItem(Storage.KEYS.ANCHOR_INT2, next);
        return next;
      });
    }
  }, []);

  // Resetare calibrare la referința implicită (miezul nopții 00:00:00)
  const resetCalibration = useCallback(
    (intId) => {
      const midnight = getMidnightTodayMs();
      if (intId === 'int1') {
        setAnchorInt1(midnight);
        setLastCalibTimeInt1(null);
        Storage.removeItem(Storage.KEYS.ANCHOR_INT1);
        Storage.removeItem(Storage.KEYS.LAST_CALIB_TIME_INT1);
      } else {
        const defaultA2 = midnight - phi * 1000;
        setAnchorInt2(defaultA2);
        setLastCalibTimeInt2(null);
        Storage.removeItem(Storage.KEYS.ANCHOR_INT2);
        Storage.removeItem(Storage.KEYS.LAST_CALIB_TIME_INT2);
      }
    },
    [phi]
  );

  // Helper pentru determinarea stării curente a unei intersecții
  const calculateIntersectionState = useCallback(
    (cycleTime, phaseDurations, yellowDur, intersectionDef) => {
      const T = phaseDurations.reduce((acc, curr) => acc + curr + yellowDur, 0);
      let t = cycleTime % T;
      if (t < 0) t += T;

      let accumulated = 0;
      let activePhase = null;
      let activePhaseIndex = 0;
      let signalState = 'RED'; // 'GREEN' | 'YELLOW' | 'RED'
      let timeRemainingInState = 0;
      let phaseTimeRemaining = 0;

      for (let i = 0; i < phaseDurations.length; i++) {
        const greenDur = phaseDurations[i];
        const phaseTotal = greenDur + yellowDur;
        const phaseStart = accumulated;
        const greenEnd = phaseStart + greenDur;
        const phaseEnd = phaseStart + phaseTotal;

        if (t >= phaseStart && t < phaseEnd) {
          activePhaseIndex = i;
          activePhase = intersectionDef.phases[i];

          if (t < greenEnd) {
            signalState = 'GREEN';
            timeRemainingInState = greenEnd - t;
            phaseTimeRemaining = phaseEnd - t;
          } else {
            signalState = 'YELLOW';
            timeRemainingInState = phaseEnd - t;
            phaseTimeRemaining = phaseEnd - t;
          }
          break;
        }
        accumulated = phaseEnd;
      }

      if (!activePhase) {
        activePhaseIndex = 0;
        activePhase = intersectionDef.phases[0];
        signalState = 'GREEN';
        timeRemainingInState = phaseDurations[0];
        phaseTimeRemaining = phaseDurations[0] + yellowDur;
      }

      return {
        T,
        currentCycleTime: t,
        activePhaseIndex,
        activePhase,
        signalState,
        phaseDurations,
        yellowDuration: yellowDur,
        timeRemainingInState: Math.max(0, timeRemainingInState),
        phaseTimeRemaining: Math.max(0, phaseTimeRemaining),
        progress: (t / T) * 100,
      };
    },
    []
  );

  // Starea Intersecției 1
  const int1State = useMemo(() => {
    return calculateIntersectionState(activeTimeInt1, int1Phases, int1Yellow, INTERSECTIONS[0]);
  }, [calculateIntersectionState, activeTimeInt1, int1Phases, int1Yellow]);

  // Starea Intersecției 2
  const int2State = useMemo(() => {
    return calculateIntersectionState(activeTimeInt2, int2Phases, int2Yellow, INTERSECTIONS[1]);
  }, [calculateIntersectionState, activeTimeInt2, int2Phases, int2Yellow]);

  // Comenzi de control manual (valabile în mod simulare)
  const togglePlayPause = () => setIsRunning((prev) => !prev);
  const stepTime = (delta) => setManualSimTime((prev) => Math.max(0, prev + delta));
  const resetSimulation = () => setManualSimTime(0);

  // Resetare timpi la valorile din schiță
  const resetToDefaults = useCallback(() => {
    setInt1Phases(INTERSECTIONS[0].phases.map((p) => p.defaultGreenDuration));
    setInt1Yellow(INTERSECTIONS[0].defaultYellowDuration);
    setInt2Phases(INTERSECTIONS[1].phases.map((p) => p.defaultGreenDuration));
    setInt2Yellow(INTERSECTIONS[1].defaultYellowDuration);
    setPhiState(0);
    setManualSimTime(0);
    Storage.removeItem(Storage.KEYS.INT1_PHASES);
    Storage.removeItem(Storage.KEYS.INT2_PHASES);
    Storage.removeItem(Storage.KEYS.INT1_YELLOW);
    Storage.removeItem(Storage.KEYS.INT2_YELLOW);
    Storage.removeItem(Storage.KEYS.PHI);
  }, []);

  // Modificare durata verde pentru o fază anume
  const updatePhaseDuration = useCallback((intId, phaseIndex, seconds) => {
    const validSec = Math.max(5, Math.min(180, Math.round(seconds)));
    if (intId === 'int1') {
      setInt1Phases((prev) => {
        const next = [...prev];
        next[phaseIndex] = validSec;
        Storage.setItem(Storage.KEYS.INT1_PHASES, next);
        return next;
      });
    } else {
      setInt2Phases((prev) => {
        const next = [...prev];
        next[phaseIndex] = validSec;
        Storage.setItem(Storage.KEYS.INT2_PHASES, next);
        return next;
      });
    }
  }, []);

  // Modificare durata galben
  const updateYellowDuration = useCallback((intId, seconds) => {
    const validSec = Math.max(2, Math.min(15, Math.round(seconds)));
    if (intId === 'int1') {
      setInt1Yellow(validSec);
      Storage.setItem(Storage.KEYS.INT1_YELLOW, validSec);
    } else {
      setInt2Yellow(validSec);
      Storage.setItem(Storage.KEYS.INT2_YELLOW, validSec);
    }
  }, []);

  return {
    // Mod ceas & Timp telefon
    clockMode,
    setClockMode,
    phoneTimeStr,
    isRealTime: clockMode === 'realtime',

    // Stări simulare
    isRunning,
    speedMultiplier,
    simTime: activeTimeInt1, // Compatibilitate directă: simTime reprezintă timpul Intersecției 1
    activeTimeInt1,
    activeTimeInt2,
    colorMode,
    phi,
    minPhi,
    maxPhi,
    T1,
    T2,
    T_ref,
    int1Phases,
    int1Yellow,
    int2Phases,
    int2Yellow,
    int1State,
    int2State,

    // Calibrare & Sincronizare la fața locului
    lastCalibTimeInt1,
    lastCalibTimeInt2,
    calibratePhaseNow,
    fineTuneOffset,
    resetCalibration,

    // Setteri & Acțiuni simulare manuală
    setIsRunning,
    setSpeedMultiplier,
    setColorMode,
    setPhi,
    togglePlayPause,
    stepTime,
    resetSimulation,
    resetToDefaults,
    updatePhaseDuration,
    updateYellowDuration,
  };
}
