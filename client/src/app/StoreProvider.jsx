'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import {UserStore,persistor} from "../lib/store/store"

export default function StoreProvider({
  children
}
) {
      
  

  return <Provider store={UserStore}>
    <PersistGate loading={null} persistor={persistor}>
    {children}
    </PersistGate>
 </Provider>
}