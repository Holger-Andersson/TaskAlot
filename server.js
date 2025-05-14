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

app.post("/task", (req, res) => {
    const file = fs.readFileSync(fileName, {
        encoding: "utf-8",
        flag: "r+",
    });
    const data = JSON.parse(file);

    data.push({
        id: uuidv4(),
      //  prio: 3,
        checked: false,
        task: req.body.task,
    });

    fs.writeFileSync(fileName, JSON.stringify(data));
    res.send({ message: `${req.params.task} is added to the list`});
});

app.get("/tasks", (req, res) => {
    res.sendFile(fileName);
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve("view", "index.html"));
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    const file = fs.readFileSync(fileName, {
        encoding: "utf-8",
        flag: "r+",
    });
    const data = JSON.parse(file);

    const newData = data.filter((d) => d.id !== id);
    fs.writeFileSync(fileName, JSON.stringify(newData));

    res.send(newData);
});



app.put("/task/checked/:id", (req, res) => {
    const data = readJsonFile().map((data) => {
    if(data.id == req.params.id) {
        data.checked = !data.checked;
    }
    return data;
    });
    writeToJsonFile(data);
    res.json(data.filter((d) => d.id === req.params.id));
});

app.listen(3000, () => {
    console.log(`Server is LIVE, listening to ${PORT}`);
});