import { useEffect, useState } from "react";

type Loading = [true, null, undefined]
type LoadedError = [false, Error, undefined]
type LoadedData<T> = [false, null, T]
type ReturnType<T> = Loading | LoadedError | LoadedData<T>;

export default function useResource<T>(resource: () => Promise<T>): ReturnType<T> {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<T>();

	useEffect(() => {
		resource()
			.then(setData)
			.catch(setError)
			.finally(() => {
				setLoading(false);
			});
	}, [resource]);


	// @ts-ignore
	return [loading, error, data]
}


type Setter<T> = (val: T) => void
type Unsubscribe = () => void
export function useWatchResource<T>(resource: (setData: Setter<T>, setLoading: Setter<boolean>, setError: Setter<Error>) => Unsubscribe): ReturnType<T> {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<T>();

	useEffect(() => {
		return resource(setData, setLoading, setError);
	}, [resource]);


	// @ts-ignore
	return [loading, error, data]
}