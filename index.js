import express from 'express';
import router from "./router.js";
import cors from 'cors';
import path from 'path';

const app = express();
const port = 5000;

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(express.json());
app.use(cors());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
