import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
export default useRouterHistory(createHashHistory)({ queryKey: true });
