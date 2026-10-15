// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.
import { useEffect, useMemo } from 'react';
import { Context } from '../../context-hooks/card-context-hooks';
import buttonImage from '../images/google-logo.svg';
import log from 'loglevel';
const logger = log.getLogger('Google');

export function CardProvider({children, intl}) {
    const contextValue = useMemo(() => {
        return {
            intl,
            components: {
                buttonImage,
                noEmail: {
                    titleId: 'google.noEmailTitle',
                    messageId: 'google.noEmailMessage'
                },
                noFiles: {
                    titleId: 'google.noFilesTitle',
                    messageId: 'google.noFilesMessage'
                },
                noEvents: {
                    titleId: 'google.noEventsTitle',
                    messageId: 'google.noEventsMessage'
                }
            }
        }
    }, [ intl ]);

    useEffect(() => {
        logger.debug('GoogleCardProvider mounted');

        return () => {
            logger.debug('GoogleCardProvider unmounted');
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}
