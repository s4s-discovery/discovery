import {
  atom, selector,
} from 'recoil';
import jsonQuery from 'json-query';

export * from './category-provider-filters';

export const resourcesState = atom({
  key: 'resourcesState', // unique ID (with respect to other atoms/selectors)
  default: {
    loading: false,
    error: null,
    raw: null,
    normalized: null,
    records: {},
    totalResCount: 0,
    patient: null,
    providers: [],
    categories: [],
    legacy: null,
  },
  // dangerouslyAllowMutability: true, // < Object.isExtensible(res.data), in: src/components/Annotation/index.js
});

export const filtersState = atom({
  key: 'filtersState',
  default: {
    dates: null,
    thumbLeftDate: null,
    thumbRightDate: null,
  },
});

export const allRecordIds = selector({
  key: 'allRecordIds',
  get: ({ get }) => {
    const { records } = get(resourcesState);
    // Return all record ids as an Array:
    return Object.entries(records).reduce((acc, [uuid, record]) => {
      if (record.category === 'Patient') {
        console.info(`IGNORE PATIENT ${uuid}`); // eslint-disable-line no-console
      }
      acc.push(uuid);
      return acc;
    }, []);
  },
});

// export const patientRecord = selector({
//   key: 'patientRecord',
//   get: ({ get }) => {
//     const { normalized } = get(resourcesState);
//     return normalized.find(({ category }) => category === 'Patient');
//   },
// });

export const labResultRecords = selector({
  key: 'labResultRecords',
  get: ({ get }) => {
    const { normalized } = get(resourcesState);
    return jsonQuery('[*category=Lab Results]', { data: normalized }).value;
  },
});

export const vitalSignsRecords = selector({
  key: 'vitalSignsRecords',
  get: ({ get }) => {
    const { normalized } = get(resourcesState);
    return jsonQuery('[*category=Vital Signs]', { data: normalized }).value;
  },
});

// TODO: ^other states facilitate implementation of something like the following:
// export const collectionsState = atom({
//   key: 'collectionsState',
//   default: {
//     activeCollection: 'default',
//     collections: {
//       default: {},
//     },
//   },
// });
