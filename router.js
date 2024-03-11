import fs from "fs";
import Router from 'express';
import multer from 'multer';
import path, { dirname, resolve, extname } from 'path';
import { readDataFromFile, writeDataToFile, getLastId } from "./utils.js";
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import { UPLOAD_PATH, DATA_FILE, API_PATH } from "./constants.js";
import { unlink } from 'fs/promises';

const router = new Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFilePath = resolve(__dirname, DATA_FILE);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueName = randomBytes(8).toString('hex');
        const extension = extname(file.originalname);
        cb(null, uniqueName + extension);
    }
});

const upload = multer({ storage: storage });

router.post(API_PATH, upload.single('file'), (req, res) => {
    try {
        const { text, email } = req.body;
        const file = req.file;
        const items = readDataFromFile();
        const item = {
            id: getLastId() + 1,
            text,
            email,
            file: file ? path.basename(file.path) : null
        };
        items.push(item);
        writeDataToFile(items);

        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2));
        }
        res.status(201).json(item);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get(API_PATH, (req, res) => {
    try {
        const items = readDataFromFile();
        res.json(items);
    } catch (e) {
        res.status(500).json(e)
    }
});

router.get(`${API_PATH}/:id`, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const items = readDataFromFile();
        const item = items.find(item => item.id === id);

        if (item) {
            res.json(item);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).json(e)
    }
});

router.put(`${API_PATH}/:id`, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const items = readDataFromFile();
        const item = items.find(item => item.id === id);

        if (item) {
            item.name = req.body.name;
            writeDataToFile(items);
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).json(e)
    }
});

router.delete(`${API_PATH}/:id`, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let items = readDataFromFile();
        const item = items.find(item => item.id === id);

        if (item && item.file) {
            await unlink(`${UPLOAD_PATH}${item.file}`);
        }

        items = items.filter(item => item.id !== id);
        writeDataToFile(items);
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.status(500).json(e)
    }
});

export default router;
