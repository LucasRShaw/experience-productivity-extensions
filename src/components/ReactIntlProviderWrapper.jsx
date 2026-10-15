import { useState, useEffect } from 'react';
import { injectIntl, IntlProvider } from 'react-intl';
import { Skeleton } from '@ellucian/react-design-system/core';
import { getMessages } from '../i18n/intlUtility';

export const withIntl = (WrappedComponent) => {
    const InjectedComponent = injectIntl(WrappedComponent);

    const WithIntl = (props) => {
        const locale = props.userInfo?.locale || 'en';
        const [messages, setMessages] = useState(null);
        useEffect(() => {
            let cancelled = false;
            const loadMessages = async () => {
                const msgs = await getMessages(locale);
                if (!cancelled) {
                    setMessages(msgs);
                }
            };
            loadMessages();
            return () => {
                cancelled = true;
            };
        }, [locale]);
        if (!messages) {
            // Small paragraph-style skeleton (a couple of short lines)
            return (
                <div style={{ padding: '4px 0' }}>
                    <Skeleton paragraph={{width: "70%", height:'1.1rem'}} />
                    <Skeleton paragraph={{width: "70%", height:'1.0rem'}} />
                </div>
            );
        }

        return (
            <IntlProvider locale={locale} messages={messages}>
                <InjectedComponent {...props} />
            </IntlProvider>
        );
    };

    WithIntl.displayName = `WithIntl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithIntl;
};