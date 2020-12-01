import React from 'react';
import { StepProvider } from './step';

const AppProvider: React.FC = ({ children }) => (
  <StepProvider>{children}</StepProvider>
);

export default AppProvider;
