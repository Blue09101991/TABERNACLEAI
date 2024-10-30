type RowObj = {
  username: string;
  plan: string;
  name: string;
  date: string | Date;
  edit: string;
};

const tableDataCheck: RowObj[] = [
  {
    username: '@vld.mihalache',
    plan: 'Expert+',
    name: 'Vlad Mihalache',
    date: 'May 24, 2023',
    edit: 'false',
  },
  {
    username: '@rsu.grafx',
    plan: 'Expert+',
    name: 'Bogdan Rusu',
    date: 'May 23, 2023',
    edit: 'true',
  },
  {
    username: '@fredyandrei',
    plan: 'Basic',
    name: 'Fredy Andrei',
    date: 'May 21, 2023',
    edit: 'true',
  },
  {
    username: '@rarestoma',
    plan: 'Power+',
    name: 'Rares Toma',
    date: 'May 20, 2023',
    edit: 'true',
  },
  {
    username: '@michael.peterson',
    plan: 'Power+',
    name: 'Michael Peterson',
    date: 'May 20, 2023',
    edit: 'false',
  },
  {
    username: '@adelaparkson',
    plan: 'Basic',
    name: 'Adela Parkson',
    date: 'May 18, 2023',
    edit: 'true',
  },
];

export default tableDataCheck;
