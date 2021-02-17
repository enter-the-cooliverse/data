import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from "url";

const projectRoot = path.join(fileURLToPath(import.meta.url), '..', '..');

async function readDirAsArray(dir) {
	const fileNames = await fs.readdir(dir);
	const array = [];
	await Promise.all(fileNames.map(async (fileName) => {
		const fileText = await fs.readFile(path.join(dir, fileName), 'utf8');
		const index = parseInt(path.basename(fileName, '.json'), 10);
		array[index] = JSON.parse(fileText);
	}));
	return array;
}

async function readDirAsObject(dir) {
	const fileNames = await fs.readdir(dir);
	const object = {};
	await Promise.all(fileNames.map(async (fileName) => {
		const fileText = await fs.readFile(path.join(dir, fileName), 'utf8');
		const index = path.basename(fileName, '.json');
		object[index] = JSON.parse(fileText);
	}));
	return object;
}

async function build() {
	const cards = await readDirAsArray(path.join(projectRoot, 'cards'));
	const skills = await readDirAsObject(path.join(projectRoot, 'skills'));

	const bundled = `// Bundled data for module import

export const cards = ${JSON.stringify(cards)};

export const skills = ${JSON.stringify(skills)};
`;

	await fs.writeFile(path.join(projectRoot, 'index.min.js'), bundled, 'utf8');
}

build().catch(console.error);
