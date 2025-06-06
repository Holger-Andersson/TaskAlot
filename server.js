import express from "express";
import path from "node:path";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

const fileName = path.resolve("data", "list.json");

function readJsonFile() {
    const file = fs.readFileSync(fileName, {
        encoding: "utf-8",
        flag: "r+",
    });
    return JSON.parse(file);
};

function writeToJsonFile(data) {
    fs.writeFileSync(fileName, JSON.stringify(data));
};

app.use("/static", express.static("public"));
app.use(bodyParser.json());

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

app.post("/task", (req, res) => {
    try {
        const data = readJsonFile();

        data.push({
            id: uuidv4(),
            prio: 3,
            checked: false,
            task: req.body.task,
        });

        writeToJsonFile(data);
        res.send({ message: `New task added to the list` });
    } catch (error) {
        console.error(JSON.stringify({ error: error.message, fn: "/task" }));
        if (error instanceof ValidationError) {
            res.status(400).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Unable to create new task" });
        }
    }
});

app.get("/tasks", (req, res) => {
    try {
        const data = readJsonFile();
        res.send(data);
    } catch (error) {
        console.log(JSON.stringify({ error: error.message, fn: "tasks" }));
        res.status(400).send({ error: "Can't load tasks" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve("view", "index.html"));
});

app.delete("/delete/:id", (req, res) => {

        const data = readJsonFile().filter((d) => d.id !== req.params.id);
        writeToJsonFile(data);
        res.send(data);
});

app.put("/task/checked/:id", (req, res) => {
        const data = readJsonFile().map((data) => {
            if (data.id == req.params.id) {
                data.checked = !data.checked;
            }
            return data;
        });
        writeToJsonFile(data);
        res.json(data.filter((d) => d.id === req.body.id));
});

app.put("/task/prio/:id", (req, res) => {
     console.log("CHECK PUT");
    const data = readJsonFile().map((data) => {
        if (data.id === req.params.id) {
            data.prio = Number.parseInt(req.body.prio);
        }
        return data;
    });

    writeToJsonFile(data);
    res.json(data.filter((d) => d.id === req.params.id));
});

app.listen(3000, () => {
    console.log(`Server is LIVE, listening to ${PORT}`);
});