import Router from 'express';
import fs from "fs";
import { readDataFromFile, writeDataToFile, getLastId } from "./utils.js";

const router = new Router();
const dataFilePath = 'users.json';

router.post('/users', (req, res) => {
    try {
        const user = req.body;
        const users = readDataFromFile();
        user.id = getLastId() + 1;
        users.push(user);
        writeDataToFile(users);

        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
        }
        res.status(201).json(user);
    } catch (e) {
        res.status(500).json(e)
    }
});

router.get('/users', (req, res) => {
    try {
        const users = readDataFromFile();
        res.json(users);
    } catch (e) {
        res.status(500).json(e)
    }
});

router.get('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const users = readDataFromFile();
        const user = users.find(user => user.id === id);

        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).json(e)
    }
});

router.put('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const users = readDataFromFile();
        const user = users.find(user => user.id === id);

        if (user) {
            user.name = req.body.name;
            writeDataToFile(users);
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).json(e)
    }
});

router.delete('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let users = readDataFromFile();
        users = users.filter(user => user.id !== id);
        writeDataToFile(users);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e)
    }
});

export default router;
