import { useState, useEffect } from 'react';
import { PcfContextService } from '../services/pcfContextService';
import { EnvironmentSettingsState } from '../types';

export function useEnvironmentSettings(pcfContext: PcfContextService): EnvironmentSettingsState {
  const [state, setState] = useState<EnvironmentSettingsState>({ settings: {}, loading: true, errorTitle: '', errorMessage: '' });

  useEffect(() => {
      const getSettings = async () => {
        try {
          // eslint-disable-next-line promise/always-return
          await pcfContext.context.webAPI.retrieveMultipleRecords('raw_azuremapsconfig').then(
            (results) => {
              if (results.entities.length > 0) {
                setState({ settings: results.entities[0], loading: false, errorTitle: '', errorMessage: '' });
              } else {
                setState({
                  settings: {},
                  loading: false,
                  errorTitle: 'No Settings found for Azure Maps',
                  errorMessage: `Please contact your administror and have then add a record in your system under the Azure Maps Config entity.`,
                });
              }
              return;
            },
            (error) => {
              setState({
                settings: {},
                loading: false,
                errorTitle: 'Error retrieving the Azure Maps Settings.',
                errorMessage: error.message,
              });
              return;
            }
          );
      } catch (error) {
        setState({ settings: {}, loading: false, errorTitle: 'Error retrieving the Azure Maps Settings.', errorMessage: error as string });
      }
    };

    getSettings();
  }, []);

  return state;
}
