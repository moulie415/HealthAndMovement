import * as _ from 'lodash';
import {useCallback, useEffect, useRef} from 'react';

function useThrottle(cb: (...args: any) => void, delay: number) {
  const options = {leading: true, trailing: false}; // add custom lodash options
  const cbRef = useRef(cb);
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb;
  });
  return useCallback(
    _.throttle((...args) => cbRef.current(...args), delay, options),
    [delay],
  );
}

export default useThrottle;
