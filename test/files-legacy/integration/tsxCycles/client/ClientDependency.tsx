import { SomeMoreHtml } from './ClientDependency2';

export function SomeHtml() {
	return <div> {} </div>;
}

export function SomeImportedHtml() {
	return SomeMoreHtml();
}
