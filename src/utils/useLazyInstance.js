import { useEffect, useRef } from 'react';

const useLazyInstance = (create, destroy) => {
	const instance = useRef();
	useEffect(() => {
		return () => destroy(instance.current);
	}, []);

	return () => {
		if (instance.current) {
			return instance.current;
		}
		return instance.current = create();
	};
};

export default useLazyInstance;
