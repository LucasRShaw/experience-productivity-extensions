/* eslint-disable jsx-a11y/alt-text */
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import classnames from 'classnames';

import { Avatar, Divider, Illustration, IMAGES, TextLink, Tooltip, Typography } from '@ellucian/react-design-system/core';
import { Icon } from '@ellucian/ds-icons/lib';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import {
    colorBrandNeutral250,
    colorBrandNeutral300,
    colorTextNeutral600,
    fontWeightBold,
    fontWeightNormal,
    spacing30,
    spacing40
} from '@ellucian/react-design-system/core/styles/tokens';

import { useExtensionControl } from '@ellucian/experience-extension-utils';

import { useIntl } from '../context-hooks/card-context-hooks.js';
import { useAuth } from '../context-hooks/auth-context-hooks';
import { useMail } from '../context-hooks/mail-context-hooks';

import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import NoEmail from './w75_NoEmail';

import { pickAvatarColor } from '../util/mail.js';

const styles = () => ({
    card: {
        flex: '1 0 auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: spacing40,
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
            marginBottom: spacing40
        },
        '& :last-child': {
            marginBottom: '0px'
        }
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: spacing40,
        marginRight: spacing40,
        '& :first-child': {
            paddingTop: '0px'
        },
        '& hr:last-of-type': {
            display: 'none'
        }
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: spacing30,
        paddingBottom: spacing30,
        paddingLeft: spacing30,
        paddingRight: spacing30,
        '&:hover': {
            backgroundColor: colorBrandNeutral250
        }
    },
    avatar: {
        color: colorTextNeutral600
    },
    messageDetailsBox: {
        paddingLeft: spacing30,
        width: 'calc(100% - 40px)',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    messageFrom: {
    },
    fromBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    subjectBox: {
        display: 'flex',
        alignItems: 'center'
    },
    subjectLink: {
        maxWidth: '100%',
        padding: '0px'
    },
    subjectLinkUnread: {
        fontWeight: fontWeightBold
    },
    subject: { },
    attachment: {
        flex: '1 0 auto',
        maxWidth: spacing40,
        marginLeft: spacing30
    },
    unread: {
        fontWeight: fontWeightBold,
        color: colorTextNeutral600
    },
    noWrap: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    fontWeightNormal: {
        fontWeight: fontWeightNormal
    },
    divider: {
        marginTop: '0px',
        marginBottom: '0px',
        backgroundColor: colorBrandNeutral300
    },
    logoutBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing40,
        marginBottom: spacing40
    },
    settings: {
        marginTop: spacing40
    }
});

function Mail({ classes }) {
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();

    const { intl } = useIntl();
    const { error: authError, login, loggedIn, logout, state: authState } = useAuth();
    const { error: mailError, fetchUnreadOnlyLabel, messageCount, unreadMessageCount, messages, state: mailState } = useMail();
    // get Outlook Allow Compose setting from .env
    const defaultAllowCompose  = (process.env.ALLOW_COMPOSE === "true" || process.env.ALLOW_COMPOSE === "True" || process.env.ALLOW_COMPOSE === "TRUE");

    const [colorsContext] = useState({ colorsUsed: [], colorsByUser: {}});

    const [displayState, setDisplayState] = useState('loading');

    useEffect(() => {
        if (authError || mailError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'error.contentNotAvailable'}),
                textMessage: intl.formatMessage({id: 'error.contactYourAdministrator'}),
                iconName: 'warning'
            })
        } else if (loggedIn === false && authState === 'ready') {
            setDisplayState('loggedOut');
        } else if (mailState === 'load') {
            setDisplayState('loading');
        } else if ((mailState === 'loaded' || mailState === 'refresh') && messages) {
            setDisplayState('loaded');
        } else if (mailState && mailState.error) {
            setDisplayState('error');
        }
    }, [ authError, authState, loggedIn, mailError, mailState, messages ])

    useEffect(() => {
        setLoadingStatus(displayState === 'loading');
    }, [displayState, mailState])

    if (displayState === 'loaded') {
        if (messages && messages.length > 0) {
            return (
                <div className={classes.content}>
                    <div className={classes.fromBox}>
                        <Tooltip title={intl.formatMessage({id: 'outlookLinkMsg'})}>
                            <Typography
                                className={classnames(classes.messageFrom, classes.unread)}
                                component='div'
                                dir={'auto'}
                                noWrap
                                variant={'body2'}
                            >
                                <TextLink className={classnames(classes.messageFrom, classes.unread)} href={intl.formatMessage({id: 'outlookURL'})} target='_blank' noWrap>
                                {intl.formatMessage({id: fetchUnreadOnlyLabel}, {unread: unreadMessageCount, count: messageCount})}
                                </TextLink>
                            </Typography>
                        </Tooltip>
                        {defaultAllowCompose && (<Tooltip title={intl.formatMessage({id: 'outlookComposeLinkMsg'})}>
                            <Typography className={classes.date} component='div' variant={'body3'}>
                                <TextLink className={classnames(classes.messageFrom, classes.unread)} href={intl.formatMessage({id: 'outlookComposeURL'})} target='_blank'>
                                    <div className={classes.attachment} style={{ minWidth: '35px'}}><Icon name='add' /><Icon name="email"/></div>
                                </TextLink>
                            </Typography>
                        </Tooltip>
                        )}
                    </div>
                    {messages.map((message) => {
                        const {
                            bodySnippet,
                            id,
                            fromEmail,
                            fromInitials,
                            fromName,
                            hasAttachment,
                            messageUrl,
                            received,
                            subject,
                            unread,
                            userPhotoUrl
                        } = message;
                        const avatarColor = pickAvatarColor(fromEmail, colorsContext);
                        return (
                            <Fragment key={id}>
                                <div className={classes.row}>
                                    <Avatar
                                        className={classes.avatar}
                                        style={{backgroundColor: avatarColor}}
                                        src={userPhotoUrl}
                                    >
                                        {fromInitials}
                                    </Avatar>
                                    <div className={classes.messageDetailsBox}>
                                        <div className={classes.fromBox}>
                                            <Typography
                                                className={classnames(classes.messageFrom, { [classes.unread]: unread })}
                                                component='div'
                                                dir={'auto'}
                                                noWrap
                                                variant={'body2'}
                                            >
                                                {fromName}
                                            </Typography>
                                            <Typography
                                                className={classes.date}
                                                component='div'
                                                variant={'body3'}
                                            >
                                                {received}
                                            </Typography>
                                        </div>
                                        <div className={classes.subjectBox}>
                                            <Typography
                                                className={classnames(classes.subject, { [classes.subjectLinkUnread]: unread })}
                                                component='div'
                                                dir={'auto'}
                                                noWrap
                                                variant={'body2'}
                                            >
                                                <TextLink className={classes.subjectLink} href={messageUrl} target='Mail-Message'>
                                                    {subject}
                                                </TextLink>
                                            </Typography>
                                            { hasAttachment && (
                                                <Tooltip title={intl.formatMessage({id: 'mail.attachment'})}>
                                                    <Icon className={classes.attachment} name='file-text' />
                                                </Tooltip>
                                            )}
                                        </div>
                                        <Typography component='div' dir={'auto'} noWrap variant='body3'>
                                            <div className={classes.noWrap} dangerouslySetInnerHTML={{__html: sanitizeHtml(bodySnippet)}}/>
                                        </Typography>
                                    </div>
                                </div>
                                <Divider classes={{ root: classes.divider }} variant={'middle'} />
                            </Fragment>
                        );
                    })}
                    {defaultAllowCompose && (<div className={classes.logoutBox}>
                        <Tooltip title={intl.formatMessage({id: 'outlookComposeLinkMsg'})}>
                            <Typography className={classes.row} component='div' variant={'body'}>
                                <TextLink className={classes.unread} href={intl.formatMessage({id: 'outlookComposeURL'})} target='_blank'>
                                    <span className={classes.attachment}><Icon name='add' /><Icon name='email'/> {intl.formatMessage({id: 'newMailLabel'})}</span>
                                </TextLink>
                            </Typography>
                        </Tooltip>
                    </div>
                    )}
                    <div className={classes.logoutBox}>
                        <SignOutButton onClick={logout}/>
                    </div>
                </div>
            );
        } else if (messages) {
            return <NoEmail />
        }
    } else if (displayState === 'loggedOut') {
        return (
            <div className={classes.card}>
                <Tooltip title={intl.formatMessage({id: 'outlookLinkMsg'})}>
                <TextLink className={classes.href} href={intl.formatMessage({id: 'outlookURL'})} target='_blank' rel='noreferrer' alt={intl.formatMessage({id: 'outlookLinkMsg'})}>
                    <Typography className={classes.fontWeightNormal} variant={'h6'}>
                    {intl.formatMessage({id: 'outlookLinkTxt'})}
                    </Typography>
                </TextLink>
                </Tooltip>
                <Tooltip title={intl.formatMessage({id: 'allowPopups'})}>
                <Illustration name={IMAGES.ID_BADGE} />
                </Tooltip>
                <Typography className={classes.fontWeightNormal} variant={'h4'} component='div'>
                    {intl.formatMessage({id: 'google.permissionsRequested'})}
                </Typography>
                <Typography className={classes.fontWeightNormal} variant={'h6'} component='div'>
                    {intl.formatMessage({id: 'allowPopups'})}
                </Typography>
                <SignInButton onClick={login}/>
            </div>
        );
    } else {
        // eslint-disable-next-line no-warning-comments
        // TODO add error case
        return null;
    }
}

Mail.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Mail);
