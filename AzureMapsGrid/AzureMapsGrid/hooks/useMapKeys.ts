import { useState, useEffect } from 'react';
import { PcfContextService } from '../services/pcfContextService';
import { MapKeys } from '../types';
import { getFieldName } from '../utils/helpers';

export function useMapKeys(pcfContext: PcfContextService): MapKeys {
  const getKeys = () => {
    const params = pcfContext.context.parameters;
    const dataSet = pcfContext.context.parameters.mapDataSet;
    return {
      lat: params.latFieldName.raw ? getFieldName(dataSet, params.latFieldName.raw) : '',
      long: params.longFieldName.raw ? getFieldName(dataSet, params.longFieldName.raw) : '',
      name: params.primaryFieldName.raw ? getFieldName(dataSet, params.primaryFieldName.raw) : '',
      description: params.descriptionFieldName.raw ? getFieldName(dataSet, params.descriptionFieldName.raw) : '',
      color: params.pushpinColorField.raw ? getFieldName(dataSet, params.pushpinColorField.raw) : '',
    };
  };

  const [keys, setKeys] = useState<MapKeys>(getKeys());

  useEffect(() => {
    setKeys(getKeys());
  }, [
    pcfContext.context.parameters.latFieldName?.raw,
    pcfContext.context.parameters.longFieldName?.raw,
    pcfContext.context.parameters.primaryFieldName?.raw,
    pcfContext.context.parameters.descriptionFieldName?.raw,
    pcfContext.context.parameters.pushpinColorField?.raw,
  ]);

  return keys;
}
