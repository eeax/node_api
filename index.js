import express from 'express';
import router from "./router.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
