const TrainTypes = {
  ALL: {
    name: '全部',
    value: 'all',
  },
  TAROKO: {
    name: '太魯閣',
    value: '1',
    labelColorClass: 'success',
  },
  PUYUMA: {
    name: '普悠瑪',
    value: '2',
    labelColorClass: 'dark',
  },
  TZE_CHIANG: {
    name: '自強',
    value: '3',
    labelColorClass: 'info',
  },
  CHU_KUANG: {
    name: '莒光',
    value: '4',
    labelColorClass: 'danger',
  },
  FU_HSING: {
    name: '復興',
    value: '5',
    labelColorClass: 'warning',
  },
  LOCAL: {
    name: '區間',
    value: '6',
    labelColorClass: 'primary',
  },
  ORDINARY: {
    name: '普快',
    value: '7',
    labelColorClass: 'primary',
  },
  FAST_LOCAL: {
    name: '區間快',
    value: '10',
    labelColorClass: 'primary',
  },
};

const TripLines = {
  NEITHER: {
    name: '',
    value: '0',
  },
  MOUNTAIN: {
    name: '山線',
    value: '1',
  },
  SEA: {
    name: '海線',
    value: '2',
  },
};

export {
  TrainTypes,
  TripLines,
};