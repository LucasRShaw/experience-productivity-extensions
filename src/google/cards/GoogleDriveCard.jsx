// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import { withIntl } from '../../components/ReactIntlProviderWrapper';

import { CardProvider } from '../context-providers/google-card-context-provider';
import { AuthProvider } from '../context-providers/google-auth-context-provider';
import { DriveProvider } from '../context-providers/google-drive-context-provider';

import Drive from '../../components/Drive';

import { initializeLogging } from '../../util/log-level';
initializeLogging('Google');

function GoogleDriveCard(props) {
    return (
            <CardProvider {...props}>
                <AuthProvider id="Drive">
                    <DriveProvider>
                        <Drive/>
                    </DriveProvider>
                </AuthProvider>
            </CardProvider>
    )
}

export default withIntl(GoogleDriveCard)