// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.
/* eslint-disable jsx-a11y/alt-text */
import classnames from 'classnames';
import { Button } from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing30 } from '@ellucian/react-design-system/core/styles/tokens';
import { useComponents, useIntl } from '../context-hooks/card-context-hooks';

const styles = () => ({
    button: { cursor: 'pointer' },
    image: { marginRight: spacing30 }
});

function SignOutButton({classes, className = '', onClick}) {
    const { intl } = useIntl();
    const { buttonImage } = useComponents();

    return (
        <Button className={classnames(className, classes.button)} color='secondary' onClick={onClick}>
            <img className={classes.image} src={buttonImage}/>
            {intl.formatMessage({id: 'signOut'})}
        </Button>
    );
}

export default withStyles(SignOutButton, styles, {name: 'SignOutButton'});