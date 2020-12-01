import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../components/Card';

import Header from '../../components/Header';
import { useStep, IPasta } from '../../hooks/step';

import { Name, Price } from './styles';
import api from '../../services/api';

const StepTwo: React.FC = () => {
  const [pizzaPastas, setPizzaPastas] = useState<IPasta[]>([]);
  const [pastaChecked, setPastaChecked] = useState<number>();

  const history = useHistory();

  const { nextStep, backStep, setPropertyPasta } = useStep();

  useEffect(() => {
    async function loadPizzaPasta(): Promise<void> {
      try {
        const response = await api.get('/pizza-pasta');

        setPizzaPastas(response.data);
      } catch (err) {
        window.alert(
          'Ops! Parece que temos um problema em nossos servidores, por favor chame o suporte!',
        );
        console.error(err);
      }
    }

    loadPizzaPasta();
  }, []);

  const handleNext = useCallback(async () => {
    if (!pastaChecked) {
      window.alert('Por favor selecione uma opção');
      return;
    }

    const chosePasta = pizzaPastas.find(pasta => pasta.id === pastaChecked);

    if (!chosePasta) {
      throw new Error('Massa não encontrada');
    }

    await setPropertyPasta(chosePasta);

    await nextStep();

    history.push('/order/step-three');
  }, [history, pizzaPastas, pastaChecked, setPropertyPasta, nextStep]);

  const handleBack = useCallback(async () => {
    await setPropertyPasta(null);

    await backStep();

    history.push('/order/step-one');
  }, [backStep, setPropertyPasta, history]);

  return (
    <>
      <Header />
      <Card>
        <div className="row">
          <div className="col-md-12">
            <h3>Massas</h3>
          </div>
        </div>

        <hr />

        {pizzaPastas.map(pasta => (
          <div key={pasta.id}>
            <label className="row" htmlFor={pasta.name}>
              <div className="col-md-1">
                <input
                  type="radio"
                  value={pasta.id}
                  checked={pasta.id === pastaChecked}
                  onChange={e => setPastaChecked(Number(e.target.value))}
                />
              </div>

              <Name className="col-md-3">{pasta.name}</Name>

              <Price className="col-md-1">
                <span>{pasta.price}</span>
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

export default StepTwo;
