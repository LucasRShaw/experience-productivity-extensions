import { createContext, useContext } from 'react';

export const Context = createContext({})

export function useCalendarEventCreator() {
    return useContext(Context);
}