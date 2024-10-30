type RowObj = {
  plan: string;
  date: string | Date | Date;
  amount: string | number;
};

const tableDataInvoice: RowObj[] = [
  {
    plan: 'Basic Plan',
    date: '1000',
    amount: '$10.00',
  },
  {
    plan: 'Normal Plan',
    date: '5000',
    amount: '$50.00',
  },
  {
    plan: 'Expert+ Plan',
    date: '10000',
    amount: '$100.00',
  },
];

export default tableDataInvoice;
