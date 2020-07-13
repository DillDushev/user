import React from 'react';

import useGlobalHook from './GlobalHook';

const initialState = { skip: 0, length: 10, BUTN_NUM: 2, limit: 10 };

const useGlobal = useGlobalHook(React, initialState);

export default useGlobal;