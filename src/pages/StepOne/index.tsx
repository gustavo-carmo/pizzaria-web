import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../components/Card';

import Header from '../../components/Header';
import { useStep, ISize, IPasta, IFilling } from '../../hooks/step';

import { Name, Price } from './styles';
import api from '../../services/api';

interface IRecomendation {
  total: number;
  size: ISize;
  pasta: IPasta;
  filling: IFilling;
}

const StepOne: React.FC = () => {
  const [pizzaSizes, setPizzaSizes] = useState<ISize[]>([]);
  const [sizeChecked, setSizeChecked] = useState<number>();
  const [recomendation, setRecomendation] = useState<IRecomendation>();

  const history = useHistory();

  const {
    nextStep,
    backStep,
    setPropertySize,
    setPropertyFilling,
    setPropertyPasta,
    setPropertyRecomendation,
    clearOrder,
  } = useStep();

  useEffect(() => {
    async function loadPizzaSize(): Promise<void> {
      try {
        const response = await api.get('/pizza-size');

        setPizzaSizes(response.data);
      } catch (err) {
        window.alert(
          'Ops! Parece que temos um problema em nossos servidores, por favor chame o suporte!',
        );
        console.error(err);
      }
    }

    loadPizzaSize();
  }, []);

  useEffect(() => {
    async function loadPizzaSize(): Promise<void> {
      try {
        const response = await api.get('/pizza-recommendation');

        setRecomendation(response.data);
      } catch (err) {
        window.alert(
          'Ops! Parece que temos um problema em nossos servidores, por favor chame o suporte!',
        );
        console.error(err);
      }
    }

    loadPizzaSize();
  }, []);

  const handleNext = useCallback(async () => {
    if (!sizeChecked) {
      window.alert('Por favor selecione uma opção');
      return;
    }

    const choseSize = pizzaSizes.find(size => size.id === sizeChecked);

    if (!choseSize) {
      throw new Error('Tamanho não encontrado');
    }

    await setPropertySize(choseSize);

    await nextStep();

    history.push('/order/step-two');
  }, [history, pizzaSizes, sizeChecked, setPropertySize, nextStep]);

  const handleBack = useCallback(async () => {
    await setPropertySize(null);

    await backStep();
  }, [backStep, setPropertySize]);

  const handleRecomendation = useCallback(() => {
    clearOrder();

    if (recomendation) {
      setPropertySize(recomendation?.size);
      setPropertyPasta(recomendation.pasta);
      setPropertyFilling(recomendation.filling);
      setPropertyRecomendation({
        total: recomendation.total,
        isRecomendation: true,
      });

      history.push('/order/show');
    }
  }, [
    clearOrder,
    setPropertyFilling,
    setPropertyPasta,
    setPropertyPasta,
    recomendation,
    setPropertyRecomendation,
  ]);

  return (
    <>
      <Header />
      <Card>
        {recomendation && (
          <>
            <div className="row">
              <div className="col-md-12">
                <h2>Recomendação</h2>
              </div>
            </div>

            <div className="row d-flex">
              <div className="col-md-3">
                <span>
                  <strong>Tamanho: </strong> {recomendation?.size.name}
                </span>
              </div>

              <div className="col-md-3">
                <span>
                  <strong>Massa: </strong> {recomendation?.pasta.name}
                </span>
              </div>
              <div className="col-md-3">
                <span>
                  <strong>Recheio: </strong> {recomendation?.filling.name}
                </span>
              </div>

              <div className="col-md-2 ml-auto">
                <button
                  className="btn btn-info"
                  type="button"
                  onClick={handleRecomendation}
                >
                  Eu quero
                </button>
              </div>
            </div>
          </>
        )}

        <strong>
          <hr />
        </strong>

        <div className="row">
          <div className="col-md-12">
            <h3>Tamanhos</h3>
          </div>
        </div>

        <hr />

        {pizzaSizes.map(size => (
          <div key={size.id}>
            <label className="row" htmlFor={size.name}>
              <div className="col-md-1">
                <input
                  type="radio"
                  value={size.id}
                  checked={size.id === sizeChecked}
                  onChange={e => setSizeChecked(Number(e.target.value))}
                />
              </div>

              <Name className="col-md-3">{size.name}</Name>

              <Price className="col-md-1">
                <span>{size.price}</span>
              </Price>
            </label>
          </div>
        ))}

        <hr />

        <div className="d-flex">
          <div className="col-md-11" />
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

export default StepOne;
