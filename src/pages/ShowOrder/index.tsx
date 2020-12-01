import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../components/Card';

import Header from '../../components/Header';
import { useStep } from '../../hooks/step';

const ShowOrder: React.FC = () => {
  const history = useHistory();

  const { size, pasta, filling, clearOrder, recomendation } = useStep();

  const handleNewOrder = useCallback(async () => {
    clearOrder();

    history.push('/order/step-one');
  }, [history, clearOrder]);

  const total = useMemo(() => {
    if (recomendation.isRecomendation) {
      return recomendation.total;
    }

    if (size.price && pasta.price && filling.price) {
      return Number(filling.price) + Number(pasta.price) + Number(size.price);
    }
    return 0;
  }, [filling, pasta, size]);

  return (
    <>
      <Header />
      <Card>
        <h2>Pedido realizado! Em breve confirmaremos seu pedido</h2>

        <hr />

        {recomendation.isRecomendation && (
          <div className="alert alert-primary" role="alert">
            Parabens! Você acabou de receber pontos de beneficios.
          </div>
        )}

        <h5 className="row">
          <strong className="col-md-2">Tamanho: </strong>
          <span>{size.name}</span>
        </h5>

        <h5 className="row">
          <strong className="col-md-2">Massa: </strong>
          <span>{pasta.name}</span>
        </h5>

        <h5 className="row">
          <strong className="col-md-2">Recheio: </strong>
          <span>{filling.name}</span>
        </h5>

        <div className="d-flex">
          <h4>
            <strong>Total: </strong>
            <span>{total}</span>
          </h4>
        </div>

        <hr />

        <div className="d-flex">
          <button
            className="btn btn-success ml-auto"
            type="button"
            onClick={handleNewOrder}
          >
            Novo Pedido
          </button>
        </div>
      </Card>
    </>
  );
};

export default ShowOrder;
