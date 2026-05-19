export interface Employee {
  id: number;
  internalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAuthorized: boolean;
  departmentId: number;
  departmentName: string;
  createdAt: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface AccessLog {
  id: number;
  attemptedInternalId: string;
  employeeId?: number;
  employeeFullName?: string;
  firstName?: string;
  lastName?: string;
  accessTimestamp: string;
  isSuccessful: boolean;
  accessType?: string;
  reasonDenied?: string;
}
