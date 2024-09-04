// src/custom.d.ts

// src/custom.d.ts
declare module '*.svg' {
	import { FunctionComponent, SVGAttributes } from 'react';
	const ReactComponent: FunctionComponent<SVGAttributes<SVGElement>>;
	export { ReactComponent };
}

declare module '*.png' {
	const content: string;
	export default content;
}
