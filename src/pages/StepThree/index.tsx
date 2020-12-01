import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../components/Card';

import Header from '../../components/Header';
import { useStep, IFilling } from '../../hooks/step';

import { Name, Price } from './styles';

import api from '../../services/api';

const StepThree: React.FC = () => {
  const [pizzaFillings, setPizzaFillings] = useState<IFilling[]>([]);
  const [fillingChecked, setFillingChecked] = useState<number>();

  const history = useHistory();

  const { nextStep, backStep, setPropertyFilling } = useStep();

  useEffect(() => {
    async function loadPizzaFilling(): Promise<void> {
      try {
        const response = await api.get('/pizza-filling');

        setPizzaFillings(response.data);
      } catch (err) {
        window.alert(
          'Ops! Parece que temos um problema em nossos servidores, por favor chame o suporte!',
        );
        console.error(err);
      }
    }

    loadPizzaFilling();
  }, []);

  const handleNext = useCallback(async () => {
    if (!fillingChecked) {
      window.alert('Por favor selecione uma opção');
      return;
    }

    const choseFilling = pizzaFillings.find(
      filling => filling.id === fillingChecked,
    );

    if (!choseFilling) {
      throw new Error('Tamanho não encontrado');
    }

    await setPropertyFilling(choseFilling);

    await nextStep();

    history.push('/order/show');
  }, [history, pizzaFillings, fillingChecked, setPropertyFilling, nextStep]);

  const handleBack = useCallback(async () => {
    await setPropertyFilling(null);

    await backStep();

    history.push('/order/step-two');
  }, [backStep, setPropertyFilling, history]);

  return (
    <>
      <Header />
      <Card>
        <div className="row">
          <div className="col-md-12">
            <h3>Recheios</h3>
          </div>
        </div>

        <hr />

        {pizzaFillings.map(filling => (
          <div key={filling.id}>
            <label className="row" htmlFor={filling.name}>
              <div className="col-md-1">
                <input
                  type="radio"
                  value={filling.id}
                  checked={filling.id === fillingChecked}
                  onChange={e => setFillingChecked(Number(e.target.value))}
                />
              </div>

              <Name className="col-md-3">{filling.name}</Name>

              <Price className="col-md-1">
                <span>{filling.price}</span>
              </Price>
            </label>
          </div>
        ))}

        <hr />

        <div className="d-flex">
          <button
            type="button"
            className="btn btn-danger p-2"
            onClick={handleBack}
          >
            Voltar
          </button>
          <div className="col-md-10" />
          <button
            className="btn btn-success p-2"
            type="button"
            onClick={handleNext}
          >
            Proximo
          </button>
        </div>
      </Card>
    </>
  );
};

export default StepThree;
