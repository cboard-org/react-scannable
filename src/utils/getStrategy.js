import Strategies from '../strategies';

const getStrategy = (strategyName, scanner) => {
  const StrategyConstructor = Strategies[strategyName] || Strategies.automatic;
  return new StrategyConstructor(scanner);
};

export default getStrategy;
