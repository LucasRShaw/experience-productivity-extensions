/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from 'react';
import { Illustration, IMAGES, List, ListItem, ListItemText, TextLink, Tooltip, Typography} from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { colorBrandNeutral250, colorBrandNeutral300, colorTextNeutral600, fontWeightBold, fontWeightNormal, spacing30, spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { useExtensionControl } from '@ellucian/experience-extension-utils';
import { useIntl } from '../context-hooks/card-context-hooks.js';
import { useAuth } from '../context-hooks/auth-context-hooks';
import { useCalendar } from '../context-hooks/calendar-context-hooks';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import NoEvents from './w75_NoEvents';
import { pickAvatarColor } from '../util/mail.js';
import { format, parseJSON, addMinutes, startOfDay } from 'date-fns';

const parseUTC = (dateStr) => parseJSON(dateStr);

const headerFmt = "EEEE, MMMM do, uuuu";
const timeFmt = "hh:mm a";
const shortDtFmt = "MMM do";
const idDtFmt = "yyyyMMdd";

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
    accepted: {
        fontWeight: fontWeightBold,
        color: colorTextNeutral600
    },
    tentativelyAccepted: {
        fontWeight: fontWeightBold,
        color: colorTextNeutral600
    },
    noWrap: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    fontWeightNormal: { fontWeight: fontWeightNormal },
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
    settings: { marginTop: spacing40 }
});

// All day items end on midnight of the following day, so we need to subtract a day from the date
const shortDateFormat = (d, allDay, allDayOffsetMinutes = 0) => {
    return allDay ? format(addMinutes(startOfDay(parseUTC(d)), allDayOffsetMinutes), shortDtFmt) : format(parseJSON(d), shortDtFmt);
}

const headerDateFormat = (d, allDay, allDayOffsetMinutes = 0) => {
    return allDay ? format(addMinutes(startOfDay(parseUTC(d)), allDayOffsetMinutes), headerFmt) : format(parseJSON(d), headerFmt);
}
const idDateFormat = (d, allDay, allDayOffsetMinutes = 0) => {
    const utcParsedDt = parseUTC(d);
    const utcParseOffsetDt = addMinutes(startOfDay(parseUTC(d)), allDayOffsetMinutes);
    return allDay ? format(utcParseOffsetDt, idDtFmt) : format(utcParsedDt, idDtFmt);
}

// All day items end on midnight of the following day, so we need to subtract a day from the date
const timeFormat = (d, allDay, allDayReplacementStr) => {
    return allDay ? allDayReplacementStr : format(parseJSON(d), timeFmt);
}

const isUrl = (s) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i');
    // console.log("isUrl("+s+"): ", Boolean(pattern.test(s)));
    return Boolean(pattern.test(s));
}

function CalendarEventCreation({ classes }) {
    const { setErrorMessage, setLoadingStatus } = useExtensionControl();

    const { intl } = useIntl();
    const { error: authError, login, loggedIn, logout, state: authState } = useAuth();
    const { error: eventError, events, state: eventState } = useCalendar();

    const [colorsContext] = useState({ colorsUsed: [], colorsByUser: {}});

    const [displayState, setDisplayState] = useState('loading');

    useEffect(() => {
        if (authError || eventError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'error.contentNotAvailable'}),
                textMessage: intl.formatMessage({id: 'error.contactYourAdministrator'}),
                iconName: 'warning'
            })
        } else if (loggedIn === false && authState === 'ready') {
            setDisplayState('loggedOut');
        } else if (eventState === 'load') {
            setDisplayState('loading');
        } else if ((eventState === 'loaded' || eventState === 'refresh') && events) {
            setDisplayState('loaded');
        } else if (eventState && eventState.error) {
            setDisplayState('error');
        }
    }, [ authError, authState, loggedIn, eventError, eventState, events, intl, setErrorMessage ])

    useEffect(() => {
        setLoadingStatus(displayState === 'loading');
    }, [displayState, eventState, setLoadingStatus])

    const scrollToTime = new Date();
    scrollToTime.setHours(7);

    if (displayState === 'loaded') {
        if (events && events.length > 0) {
            // console.log("Events: ", events);
            let curHeader = 'junk';
            return (
                <div id={`myCalendar_Container`}>
                    <List component="nav" key={`CalendarEventCreationItemsList`} dense style={{border: '1px solid #ddd' }}>
                        {events && events.map((item) => {
                            const {
                                    title,
                                    start,
                                    startTZ,
                                    end,
                                    endTZ,
                                    allDay,
                                    calendarEventLink,
                                    color,
                                    eventId: id,
                                    bodySnippet,
                                    isAccepted,
                                    isTentative,
                                    fromEmail,
                                    fromInitials,
                                    fromName,
                                    hasAttachment,
                                    location,
                                    status
                            } = item;
                            // console.log("In Render EventList: start: '"+start+"', startTZ: '"+startTZ, item);
                            const header = headerDateFormat(start, allDay);
                            const printHeader = (header !== curHeader);
                            let itemStatus = "not accepted";
                            if (isTentative) { itemStatus = "tentative"; }
                            // console.log(isAccepted, status);
                            if (isAccepted) {
                                itemStatus = status;
                            }
                            if (printHeader) { curHeader = header; }
                            const startTime = timeFormat(start, allDay, "All");
                            const endTime = timeFormat(end, allDay, "Day");
                            const startDateShort = shortDateFormat(start, allDay);
                            const endDateShort = shortDateFormat(end, allDay, -1);
                            const idDt = idDateFormat(parseUTC(start), idDtFmt);
                            // const dateRange = startDateShort == endDateShort ? startDateShort : startDateShort + " - " + endDateShort;
                            let timeRange = (allDay ? "All Day" : startTime + " - " + endTime);
                            if (startTime == endTime) { timeRange = startTime; }
                            let eventDetails = startDateShort == endDateShort ? startDateShort + " from " + timeRange : startDateShort + " to " + endDateShort + " from " + timeRange;
                            if (allDay) {
                                eventDetails = startDateShort == endDateShort ? "All Day on " + startDateShort : "All Day from " + startDateShort + " to " + endDateShort;
                            }
                            // console.log("TIME STUFF: allDay: "+allDay+", eventDetails: '"+eventDetails+"', start: '"+start+"', end: ', '"+end+"', startTime: '"+startTime+"', endTime: '"+endTime+"', startDateShort: '"+startDateShort+"', endDateShort: '"+endDateShort+"', timeRange: '"+timeRange+"'");
                            const itemLink = isUrl(location) ? location : calendarEventLink;
                            // console.log(location, calendarEventLink);
                            const avatarColor = pickAvatarColor(fromEmail, colorsContext);
                            return (<Fragment key={id}>
                                {start && printHeader && (
                                <ListItem divider key={`dateHeader_${idDt}`} id={`dateHeader_${idDt}`}>
                                    <ListItemText>
                                        <Typography noWrap variant={'h5'} style={{textAlign: 'center'}}>{header}</Typography>
                                    </ListItemText>
                                </ListItem>
                                )}
                                <ListItem divider button disableGutters key={`event_${id}`} style={{ paddingLeft: '.25rem' }}
                                        component='a' href={calendarEventLink} >
                                    <ListItemText key={`eventTimeStatus_${id}`} button style={{ borderRight: '.25rem solid ' + color, textAlign: 'center', minWidth: '70px', maxWidth: '70px' }}>
                                        <Typography key={`eventTimeStatus_${id}_startTime`} id={`eventTimeStatus_${id}_startTime`} variant={"body2"}>
                                            {startTime}
                                        </Typography>
                                        <Typography key={`eventTimeStatus_${id}_endTime`} id={`eventTimeStatus_${id}_endTime`} variant={"body2"}>
                                            {endTime}
                                        </Typography>
                                        <Typography key={`eventTimeStatus_${id}_itemStatus`}  noWrap variant={"body3"} title={itemStatus}>
                                            {itemStatus}
                                        </Typography>
                                    </ListItemText>
                                    <ListItemText key={`eventOrgTitleLoc_${id}`} style={{ paddingLeft: '.5rem', maxWidth: '209xxx'}}>
                                        <Typography key={`eventOrgTitleLoc_${id}_orgtypography`} noWrap variant={"body3"}
                                                    style={{textAlign: 'justify', backgroundColor: avatarColor}}>
                                            {intl.formatMessage({id: 'eventOrganizerLabel'})} {fromName}
                                        </Typography>
                                        <Typography key={`eventOrgTitleLoc_${id}_titletypography`} id={`eventOrgTitleLoc_${id}_titletypography`}
                                                    noWrap variant={"body2"} title={`${title} | ${eventDetails}`}>
                                            {title} | {eventDetails}
                                        </Typography>
                                        {isUrl(itemLink) && (
                                            <Typography key={`eventOrgTitleLoc_${id}_locationtypography`} noWrap variant={"body3"} style={{textAlign: 'left'}}
                                                        title={`${intl.formatMessage({id: 'eventLocationLabel'})} ${location}`}>
                                                <span>{intl.formatMessage({id: 'eventLocationLabel'})} </span>
                                                <TextLink key={`meeting_link_${id}`} id={`meeting_link_${id}`} className={classes.subjectLink} href={itemLink}>
                                                    {location}
                                                </TextLink>
                                            </Typography>
                                        )}
                                        {!isUrl(itemLink) && (
                                            <Typography key={`eventOrgTitleLoc_${id}_locationtypography`} noWrap variant={"body3"}  style={{textAlign: 'left'}}
                                                        title={`${intl.formatMessage({id: 'eventLocationLabel'})} ${location}`}>
                                                {intl.formatMessage({id: 'eventLocationLabel'})} {location}
                                            </Typography>
                                        )}
                                    </ListItemText>
                                </ListItem>
                            </Fragment>
                        )})}
                    </List>
                    <div className={classes.logoutBox}>
                        <SignOutButton onClick={logout}/>
                    </div>
                </div>
            );
        } else if (events) {
            return <NoEvents />
        }
    } else if (displayState === 'loggedOut') {
        return (
            <div className={classes.card}>
                <Tooltip title={intl.formatMessage({id: 'outlookCalendarLinkMsg'})}>
                <TextLink className={classes.href} href={intl.formatMessage({id: 'outlookCalendarURL'})} target='_blank' rel='noreferrer' alt={intl.formatMessage({id: 'outlookCalendarLinkMsg'})}>
                    <Typography className={classes.fontWeightNormal} variant={'h6'}>
                    {intl.formatMessage({id: 'outlookCalendarLinkTxt'})}
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
        // TODO add error case
        return null;
    }
}

export default withStyles(CalendarEventCreation, styles, {name: 'CalendarEventCreation'});
