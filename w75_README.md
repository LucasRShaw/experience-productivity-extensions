# <a name="w75-microsoft-outlook-card"></a>W75 Microsoft Outlook Card Notes
This fork includes a W75 version of the Microsoft Outlook Card that includes enhancements to allow Experience developers to configure the Outlook Card to have a number of items other than 10 returned to the card (currently using the `OUTLOOK_MAX_MESSAGE_COUNT` variable in the .env file), and also whether or not to render only unread messages (using the `OUTLOOK_FETCH_UNREAD_ONLY` variable in the `.env` file).  Both of these also have a stub for an Experience configuration variable that can be set in Experience, but it is currently unused.  These changes also include the addition of a count of unread messages (from a second Microsoft Graph API call to the Inbox folder) in the `Mail` view and a link to the inbox for the `NoEmail` view.  The Login view of the card was updated to remind users to allow pop-ups for the Experience site and also to provide a direct link to the outlook inbox if they are having issues with popups.  This link and the inbox link from the logged in view was changed to use an internationalized string for the URL so it is configurable with the internationalization (i18n) subsystem. The most recent change adds the ability to compose e-mails, which is enabled by including `ALLOW_COMPOSE` in the `.env` file.  When enabled, this uses new internationalization messages for links and messages associated with the links to compose an e-mail message (either in the default e-mail client or on the Outlook website).  The new compose functionality does not work on mobile as well as on desktop, which is why the feature defaults to off (if you do not configure it).  The screenshots below show it on, but it is currently not used.

![](docs/images/w75_microsoft-outlook-card-preview.png)

Code for the W75 Microsoft Outlook Card has a `w75_` prefix, and can be used from the w75 enhanced build scripts in the project without changes with the following exceptions:

`package.json` is a copy of the 75_package.json if you check it out directly from this project.

## Modifications Required to Enable W75 Version of the Microsoft Outlook Card
1. To enable the  W75 packaging, you will need to backup your `package.json` and replace it with the W75 version (e.g. rename `package.json` to `package_orig.json` and copy `w75_package.json` to `package.json`).  This allows you to use the '`npm run`' commands `w75_microsoft-build-dev`, `w75_microsoft-build-prod`, `w75_microsoft-deploy-dev`, `w75_microsoft-deploy-prod`, and `w75_microsoft-start` to build both the Outlook and OneDrive Cards with the w75 code base.  You can use `w75_outlook-start` to build only the Outlook Card or `w75_onedrive-start` to build only the OneDrive card.  When you use the separate OneDrive and Outlook targets, the OneDrive Card will lose the two custom parameters used by the Outlook Card since it does not use them.
2. The following code files need to be used instead of the originals (rename the originals, then copy the w75 version with the appropriate name):
    `src\i18n\w75_en.json`  - This contains additions and changes to the original `en.json` that are used by the w75 version.
3. Add the `OUTLOOK_MAX_MESSAGE_COUNT` and `OUTLOOK_FETCH_UNREAD_ONLY` variables to your `.env` file and configure them as desired (defaults can be found in the `w75_sample.env`).  The defaults are 10 for `OUTLOOK_MAX_MESSAGE_COUNT` and true for `OUTLOOK_FETCH_UNREAD_ONLY` respectively.
4. Change w75_microsoft-extension.js and replace the publisher of "`Your Institution`" with your institution name and in the card information (`title` and `description`), replace `{Institution Acronym}` with your institution's acronym - e.g. replace Your Institution with `My College` and replace `{Institution Acronym}` with `MyC`.  Optionally, change the card `type` to `{YOURINSTCODE}_OutlookCard` (use your institution code (`W##`) instead of `W75`).

You may need to remove your `package-lock.json` if you have issues with it when building the project.  You can also delete your `node_modules` directory to start a clean build.


### Package Version Updates:
Several packages were updated in the package.json to their latest applicable versions as of the writing of this document:

Dependencies were changed as such:
- Modifications to `dependencies`:
    - Upgraded `@azure/msal-browser` to `2.33.0`
    - Upgraded `@microsoft/mgt-components` to `2.9.0`
    - Upgraded `Wmicrosoft/microsoft-graph-client` to `3.0.5`
    - Upgraded `react-intl` to `5.12.5` (also changed the code for `components\ReactIntlProviderWrapper.jsx` and `i18n\intlUtilty.js` to those used by the Ellucian SDK Examples for `Experience SDK v5.7.0`)
    - Upgraded `sanitize-html` to `2.9.0`
    - Added `@ellucian/ds-icons` (from Ellucian Path Design system) version `7.1.1` (older version was in Dev Dependencies)
    - Added `@ellucian/experience-extension-utils` version `1.0.0` (replaces the experience-extension-hooks)
    - Added `@ellucian/react-design-system` (Ellucian Path Design system) version `7.1.1` (older version was in Dev Dependencies)
    - Added `date-fns-tz` version `2.0.0`
    - Removed `moment` (replaced by `date-fns` in EESDK v 7.0)

Dev dependencies also changed:
 - Modifications to `devDependencies`:
    - Upgraded `@ellucian/experience-extension` to `7.0.0`
    - Upgraded `@babel/eslint-parser` to `7.18.2`
    - Upgraded `@babel/plugin-transform-runtime` to `7.18.6`
    - Upgraded `@babel/preset-env` to `7.18.6`
    - Upgraded `@babel/preset-react` to `7.18.6`
    - Upgraded `cross-env` to `7.0.3`
    - Upgraded `dotenv-webpack` to `7.1.1`
    - Upgraded `eslint` to `8.32.0`
    - Upgraded `eslint-plugin-import` to `2.26.0`
    - Upgraded `eslint-plugin-jsx-a11y` to `6.6.0`
    - Upgraded `eslint-plugin-react` to `7.30.1"`
    - Upgraded `webpack` to `5.76.1`
    - Upgraded `webpack-cli` to `5.0.1`
    - Upgraded `webpack-dev-server` to `4.11.1`
    - Removed  `enzyme-adapter-react-16`
    - Removed  `eslint-plugin-jest`
    - Removed  `jest` 
    - Removed  `jest-junit` 
    - Removed  `expect` 


## Building the W75 Version of the Microsoft Outlook Card
Once the above changes are in place, make sure your .env file is configured correctly for your target environment(s) and execute '`npm run w75_microsoft-start`' from the terminal in VS Code (or your commandline window) to start the continuous build-deploy mode or '`npm run w75_microsoft-build-{prod|dev}`' and '`npm run w75_microsoft-deploy-{prod|dev}`' to do a single build/deploy (e.g. execute '`npm run w75_microsoft-build-dev`' and then execute '`npm run w75_microsoft-deploy-dev`'). NOTE: when using '`npm run w75_microsoft-start`', you will need to kill the loop (e.g. with `Ctrl+C` then enter '`Y`' to terminate the batch job) and restart it if you make changes to the `.env` file.  Note that when using the `w75_microsoft` build scripts, all cards will be built together.  

To build the Microcoft Outlook Card in isolation, you must use the `npm run w75_outlook-build-{dev|prod}` and `npm run w75_outlook-deploy-{dev|prod}` scripts or the `npm run w75_outlook-build-{dev|prod}` or `npm run w75_outlook-start` for the continuous build mode (which must be halted with `Ctrl+C` and a `Y` confirmation).  


# <a name="w75-microsoft-onedrive-card"></a>W75 Microsoft OneDrive Card Notes
This fork includes a W75 version of the Microsoft OneDrive Card that customizes the message on the login view to include information about allowing pop-ups or trying to Ctrl+Click on the Sign In button.  

Notes: Like the W75 Microsoft Outlook Card, this card has its own npm build targets.  The W75 OneDrive card does not have any changes related to the `ALLOW_COMPOSE` feature of the Outlook and Calendar cards.

![](docs/images/w75_microsoft-onedrive-card-preview.png)

## Building the W75 Version of the Microsoft OneDrive Card
Once the required changes are in place, make sure your .env file is configured correctly for your target environment(s) and execute '`npm run w75_microsoft-start`' from the terminal in VS Code (or your commandline window) to start the continuous build-deploy mode or '`npm run w75_microsoft-build-{prod|dev}`' and '`npm run w75_microsoft-deploy-{prod|dev}`' to do a single build/deploy (e.g. execute '`npm run w75_microsoft-build-dev`' and then execute '`npm run w75_microsoft-deploy-dev`'). NOTE: when using '`npm run w75_microsoft-start`', you will need to kill the loop (e.g. with `Ctrl+C` then enter '`Y`' to terminate the batch job) and restart it if you make changes to the `.env` file.  Note that when using the `w75_microsoft` build scripts, all cards will be built together.  

To build the Microcoft OneDrive Card in isolation, you must use the `npm run w75_onedrive-build-{dev|prod}` and `npm run w75_onedrive-deploy-{dev|prod}` scripts or the `npm run w75_onedrive-build-{dev|prod}` or `npm run w75_onedrive-start` for the continuous build mode (which must be halted with `Ctrl+C` and a `Y` confirmation).  

# <a name="w75-microsoft-outlook-calendar-card"></a>W75 Microsoft Outlook Calendar Card Notes
This fork includes a prototype Calendar element that uses the Microsoft Graph API (using the same codebase as the Microsoft Outlook Card) to retrieve calendar events from the user's calendar for the next 7 days starting at midnight of the current day and display them in a list format.  Each event is linked to the URL of the event on the Outlook Calendar so the user may read the full body of the event and click any embedded links to online meetings.  The link makes use of the `OUTLOOK_USE_WEB_LINK` parameter The color scheme is based on the NWC Red color (HTML Color #A71000), where Accepted events (accepted or events where the user is the orgainizer) are highlighted in NWC Red, and Tentatively Accepted Events are highlighted in 18% lighter version of NWC Red (HTML Color #C7665C), while events that have not been accepted or are in a different status than Accepted (or Organizer) or Tentatively Accepted are highlighted with 36% lighter version of NWC Red (HTML Color #E6BCB8).  The 18% color difference stems from the observation that the 600 and 500 versions of the colors in the Ellucian Path Design System are 18% lighter (e.g. using [ShadowLord](https://noeldelgado.github.io/shadowlord/#a71000) with 18% differential). The W75 Microsoft Calendar card does not limit the number of events returned like the W75 Microsoft Outlook Card, but does have an arbitrary, explicit limit of `250` messages built into the Graph Query.

A new compose Calendar Event feature has been added, which is linked to the one for Email (turned on by the same `ALLOW_COMPOSE` option in the `.env` file).  This feature seems to work well for the online outlook calendar function, though when used on mobile devices, the tab opened to the online outlook does not close when the event has been saved, but rather reloads ready to create a new event.  This could be a useful feature if you need to enter many events at a time, but more likely will result in confusion by the user.  Screenshots below show the feature enabled, but like with mail this feature is disabled by default.

![](docs/images/w75_microsoft-calendar-card-preview.png)

## Building the W75 Microsoft Outlook Calendar Card
As part of implementing this project, we brought it up to the current Ellucian SDK version (SDK v7.0.0 and Path Design v7.1.1 as of the writing of this document).  Part of this was replacing the use of moment.js with date-fns as well as updating dependencies.

Like the other cards, you may execute '`npm run w75_microsoft-start`' from the terminal in VS Code (or your commandline window) to start the continuous build-deploy mode or '`npm run w75_microsoft-build-{prod|dev}`' and '`npm run w75_microsoft-deploy-{prod|dev}`' to do a single build/deploy (e.g. execute '`npm run w75_microsoft-build-dev`' and then execute '`npm run w75_microsoft-deploy-dev`'). NOTE: when using '`npm run w75_microsoft-start`', you will need to kill the loop (e.g. with `Ctrl+C` then enter '`Y`' to terminate the batch job) and restart it if you make changes to the `.env` file.  Note that when using the `w75_microsoft` build scripts, all cards will be built together.  

To build the Microcoft OneDrive Card in isolation, you must use the `npm run w75_calendar-build-{dev|prod}` and `npm run w75_calendar-deploy-{dev|prod}` scripts or the `npm run w75_calendar-build-{dev|prod}` or `npm run w75_calendar-start` for the continuous build mode (which must be halted with `Ctrl+C` and a `Y` confirmation).  

