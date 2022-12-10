import express, { json } from "express";
import cors from "cors";
import router from "../routes/index.js";


const server = express();

server.use(cors());
server.use(express.json());

server.use(router);

server.listen(5000, () => console.log("server running at port 5000!"));
