import React, { createContext, useCallback, useState, useContext } from 'react';

export interface IPasta {
  id: number;
  name: string;
  price: number;
}

export interface ISize {
  id: number;
  name: string;
  price: number;
}

export interface IFilling {
  id: number;
  name: string;
  price: number;
}

interface IRecomendation {
  total: number;
  isRecomendation: boolean;
}

interface IStepContextData {
  currentStep: number;
  pasta: IPasta;
  size: ISize;
  filling: IFilling;
  recomendation: IRecomendation;
  nextStep(): Promise<void>;
  backStep(): Promise<void>;
  setPropertyPasta(pasta: IPasta | null): Promise<void>;
  setPropertySize(size: ISize | null): Promise<void>;
  setPropertyFilling(filling: IFilling | null): Promise<void>;
  setPropertyRecomendation(recomendation: IRecomendation): Promise<void>;
  clearOrder(): void;
}

const StepContext = createContext<IStepContextData>({} as IStepContextData);

const StepProvider: React.FC = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const currentStepStoraged = localStorage.getItem('@PizzaHouse:currentStep');

    if (currentStepStoraged) {
      return Number(currentStepStoraged);
    }

    return 1;
  });

  const [pasta, setPasta] = useState<IPasta>(() => {
    const pastaStoraged = localStorage.getItem('@PizzaHouse:pasta');

    if (pastaStoraged) {
      return JSON.parse(pastaStoraged);
    }

    return {} as IPasta;
  });

  const [size, setSize] = useState<ISize>(() => {
    const sizeStoraged = localStorage.getItem('@PizzaHouse:size');

    if (sizeStoraged) {
      return JSON.parse(sizeStoraged);
    }

    return {} as ISize;
  });

  const [filling, setFilling] = useState<IFilling>(() => {
    const fillingStoraged = localStorage.getItem('@PizzaHouse:filling');

    if (fillingStoraged) {
      return JSON.parse(fillingStoraged);
    }

    return {} as IFilling;
  });

  const [recomendation, setRecomendation] = useState<IRecomendation>(
    {} as IRecomendation,
  );

  const nextStep = useCallback(async () => {
    if (!currentStep) {
      setCurrentStep(1);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }

    localStorage.setItem('@PizzaHouse:currentStep', String(currentStep));
  }, [currentStep]);

  const backStep = useCallback(async () => {
    if (!currentStep) {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }

    localStorage.setItem('@PizzaHouse:currentStep', String(currentStep));
  }, [currentStep]);

  const setPropertyPasta = useCallback(async (propertyPasta: IPasta) => {
    setPasta(propertyPasta);

    if (propertyPasta === null) {
      localStorage.removeItem('@PizzaHouse:pasta');
    } else {
      localStorage.setItem('@PizzaHouse:pasta', JSON.stringify(propertyPasta));
    }
  }, []);

  const setPropertySize = useCallback(async (propertySize: ISize) => {
    setSize(propertySize);

    if (propertySize === null) {
      localStorage.removeItem('@PizzaHouse:size');
    } else {
      localStorage.setItem('@PizzaHouse:size', JSON.stringify(propertySize));
    }
  }, []);

  const setPropertyFilling = useCallback(async (propertyFilling: IFilling) => {
    setFilling(propertyFilling);

    if (propertyFilling === null) {
      localStorage.removeItem('@PizzaHouse:filling');
    } else {
      localStorage.setItem(
        '@PizzaHouse:filling',
        JSON.stringify(propertyFilling),
      );
    }
  }, []);

  const setPropertyRecomendation = useCallback(
    async (propertyRecomendation: IRecomendation) => {
      setRecomendation(propertyRecomendation);
    },
    [],
  );

  const clearOrder = useCallback(() => {
    localStorage.removeItem('@PizzaHouse:pasta');
    localStorage.removeItem('@PizzaHouse:size');
    localStorage.removeItem('@PizzaHouse:filling');

    localStorage.setItem('@PizzaHouse:currentStep', '1');
  }, []);

  return (
    <StepContext.Provider
      value={{
        currentStep,
        pasta,
        size,
        filling,
        recomendation,
        nextStep,
        backStep,
        setPropertyPasta,
        setPropertyFilling,
        setPropertySize,
        setPropertyRecomendation,
        clearOrder,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

function useStep(): IStepContextData {
  const context = useContext(StepContext);

  if (!context) {
    throw new Error('useStep must be used within an StepProvider');
  }

  return context;
}

export { StepProvider, useStep };
