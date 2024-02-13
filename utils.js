import fs from "fs";

const dataFilePath = './users.json';

export function readDataFromFile() {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            console.error('Ошибка чтения файла:', error.message);
            return [];
        }
    }
}

export function writeDataToFile(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export function getLastId() {
    const users = readDataFromFile();
    if (users.length === 0) {
        return 0;
    }
    return users[users.length - 1].id;
}
