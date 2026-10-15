import { withIntl } from '../../components/ReactIntlProviderWrapper';
import { MicrosoftCardProvider } from '../context-providers/w75_microsoft-card-context-provider';
import { MicrosoftAuthProvider } from '../context-providers/microsoft-auth-context-provider';
import { MicrosoftCalendarEventCreatorProvider } from '../context-providers/w75_microsoft-calendar-event-creator-context-provider';
import CalendarEventCreation from '../../components/w75_Calendar_Event_Creator';
import { initializeLogging } from '../../util/log-level';
initializeLogging('Microsoft');

function OutlookCalendarEventCreatorCard(props) {
    return (
        <MicrosoftCardProvider {...props}>
            <MicrosoftAuthProvider>
                <MicrosoftCalendarEventCreatorProvider>
                    <CalendarEventCreation />
                </MicrosoftCalendarEventCreatorProvider>
            </MicrosoftAuthProvider>
        </MicrosoftCardProvider>
    )
}

export default withIntl(OutlookCalendarEventCreatorCard);
