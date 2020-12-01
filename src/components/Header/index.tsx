import React from 'react';

import { Container } from './styles';

import Logo from '../../assets/pizza-house.png';

const Header: React.FC = () => (
  <Container>
    <header>
      <img src={Logo} alt="Pizza House" />
    </header>
  </Container>
);

export default Header;
