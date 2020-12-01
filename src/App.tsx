import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import AppProvider from './hooks/index';

import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <>
    <GlobalStyle />

    <BrowserRouter>
      <AppProvider>
        {/* <h1>Hello world</h1> */}

        <Routes />
      </AppProvider>
    </BrowserRouter>
  </>
);

export default App;
