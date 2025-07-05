import { useState, useEffect } from 'react';
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { CameraBoundsOptions, data } from 'azure-maps-control';
import { PcfContextService } from '../services/pcfContextService';
import { MapKeys, MarkerData } from '../types';
import { generateBoundingBox, checkLatitude, checkLongitude } from '../utils/helpers';

export function useMarkers(pcfContext: PcfContextService, keys: MapKeys): MarkerData {
  const getMarkers = (): MarkerData => {
    const dataSet = pcfContext.context.parameters.mapDataSet;
    const _invalidRecords: string[] = [];
    const _validRecords: DataSetInterfaces.EntityRecord[] = [];
    const _cameraOptions: CameraBoundsOptions = { padding: 20 };
    const returnData = { valid: _validRecords, invalid: _invalidRecords, cameraOptions: _cameraOptions };

    if (!dataSet || !keys.lat || !keys.long) {
      return returnData;
    }

    const totalRecordCount = dataSet.sortedRecordIds.length;
    const locationResults: data.Position[] = [];

    for (let i = 0; i < totalRecordCount; i++) {
      const recordId = dataSet.sortedRecordIds[i];
      const record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
      const lat = record.getValue(keys.lat) as number;
      const long = record.getValue(keys.long) as number;
      const name = record.getValue(keys.name) as string;

      if (!checkLatitude(lat) || !checkLongitude(long)) {
        returnData.invalid.push(`Name: ${name}, Lat: ${lat ? lat.toString() : ''}, Long: ${long ? long.toString() : ''}`);
        continue;
      }

      returnData.valid.push(record);
      locationResults.push([long, lat]);
    }

    if (_validRecords.length > 0) {
      returnData.cameraOptions.bounds = generateBoundingBox(locationResults);
    }

    return returnData;
  };

  const [markers, setMarkers] = useState<MarkerData>(getMarkers());

  useEffect(() => {
    if (pcfContext.context.parameters.mapDataSet.loading === false) {
      setMarkers(getMarkers());
    }
  }, [pcfContext.context.parameters.mapDataSet]);

  return markers;
}
