import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CLOCK_MODE: '@semafor_clock_mode',
  ANCHOR_INT1: '@semafor_anchor_int1',
  ANCHOR_INT2: '@semafor_anchor_int2',
  PHI: '@semafor_phi',
  INT1_PHASES: '@semafor_int1_phases',
  INT2_PHASES: '@semafor_int2_phases',
  INT1_YELLOW: '@semafor_int1_yellow',
  INT2_YELLOW: '@semafor_int2_yellow',
  LAST_CALIB_TIME_INT1: '@semafor_calib_time_int1',
  LAST_CALIB_TIME_INT2: '@semafor_calib_time_int2',
};

export const Storage = {
  async getItem(key, defaultValue = null) {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val === null || val === undefined) return defaultValue;
      return JSON.parse(val);
    } catch (e) {
      console.warn(`[Storage] Failed to read ${key}:`, e);
      return defaultValue;
    }
  },

  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Failed to write ${key}:`, e);
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage] Failed to remove ${key}:`, e);
    }
  },

  KEYS: STORAGE_KEYS,
};
