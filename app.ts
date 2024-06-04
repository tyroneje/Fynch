import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotevnv.config();

const app = express();
const port = parseInt(process.env.PORT as string);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => { });

app.get('/amount', (req, res) => { });

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})