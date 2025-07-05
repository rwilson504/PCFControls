/* eslint-disable @typescript-eslint/no-explicit-any */
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { data, MapMouseEvent, PopupOptions } from 'azure-maps-control';
import * as atlas from 'azure-maps-control';

export const isAzureGoverment = (settings: any): boolean => {
  return settings?.raw_azuregovernment === true || false;
};

export const generateBoundingBox = (locationResults: data.Position[]): atlas.data.BoundingBox | undefined => {
  if (locationResults.length > 0) {
    locationResults.sort(compareLocationValues('latitude'));
    const minLat = locationResults[0][1];
    const maxLat = locationResults[locationResults.length - 1][1];
    locationResults.sort(compareLocationValues('longitude'));
    const minLong = locationResults[0][0];
    const maxLong = locationResults[locationResults.length - 1][0];
    return atlas.data.BoundingBox.fromEdges(minLong, minLat, maxLong, maxLat);
  }
  return undefined;
};

export const getPopupOptions = (e: MapMouseEvent): PopupOptions => {
  const prop: any = e.shapes![0];
  const coordinates = prop.getCoordinates();
  return {
    closeButton: true,
    position: coordinates,
    pixelOffset: [0, -5],
    showPointer: true,
  };
};

export const getPopupProperties = (e: MapMouseEvent) => {
  const prop: any = e.shapes![0];
  return prop.getProperties();
};

export const getFieldName = (dataSet: ComponentFramework.PropertyTypes.DataSet, fieldName: string): string => {
  if (fieldName.indexOf('.') == -1) return fieldName;
  const linkedFieldParts = fieldName.split('.');
  linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || '';
  return linkedFieldParts.join('.');
};

export const compareLocationValues = (key: 'latitude' | 'longitude', order: 'asc' | 'desc' = 'asc') => {
  return function innerSort([a, b]: data.Position, [c, d]: data.Position): number {
    const loc = key === 'latitude' ? { a: b, b: d } : { a: a, b: c };
    let comparison = 0;
    if (loc.a > loc.b) {
      comparison = 1;
    } else if (loc.a < loc.b) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
};

export const checkLatitude = (lat: any): boolean => {
  if (!lat) return false;
  lat = typeof lat === 'number' ? lat.toString() : lat;
  const latExpression: RegExp = /^(\+|-)?(?:90(?:(?:\.0{1,10})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,10})?))$/;
  return latExpression.test(lat);
};

export const checkLongitude = (long: any): boolean => {
  if (!long) return false;
  long = typeof long === 'number' ? long.toString() : long;
  const longExpression: RegExp = /^(\+|-)?(?:180(?:(?:\.0{1,10})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,10})?))$/;
  return longExpression.test(long);
};
