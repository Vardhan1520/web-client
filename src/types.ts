export interface Department {
  DEPARTMENT_ID: number;
  DEPARTMENT_NAME: string;
}

export interface Employee {
  EMP_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  DOB: string;
  GENDER: string;
  DEPARTMENT: number;
}

export interface Payment {
  PAYMENT_ID: number;
  EMP_ID: number;
  AMOUNT: number;
  PAYMENT_TIME: string;
}

export interface ResultRow {
  EMP_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  DEPARTMENT_NAME: string;
  YOUNGER_EMPLOYEES_COUNT: number;
}
