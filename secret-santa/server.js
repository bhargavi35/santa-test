const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Increase request size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Use memory storage for multer to handle files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Ensure "output/" folder exists before writing files
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const PORT = process.env.PORT || 5000;

// ✅ Testing API
app.get("/", (req, res) => {
    res.send("API is working! 🔥");
});

// ✅ Secret Santa Assignment Endpoint (Fixed)
app.post(
    "/santa",
    upload.fields([
        { name: "employees", maxCount: 1 },
        { name: "previousAssignments", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            if (!req.files || !req.files["employees"]) {
                return res.status(400).json({ error: "Employee file is required" });
            }

            // ✅ Read files from memory
            const employeesFile = req.files["employees"][0];
            const previousAssignmentsFile = req.files["previousAssignments"] ? req.files["previousAssignments"][0] : null;

            const employees = await parseCSV(employeesFile.buffer);
            const previousAssignments = previousAssignmentsFile ? await parseCSV(previousAssignmentsFile.buffer) : [];

            console.log("✅ Parsed Employees:", employees);
            console.log("✅ Parsed Previous Assignments:", previousAssignments);

            if (employees.length === 0) {
                return res.status(400).json({ error: "No employees found in uploaded CSV." });
            }

            const assignments = assignSecretSanta(employees, previousAssignments);
            console.log("✅ Secret Santa Assignments:", assignments);

            if (!assignments || assignments.length === 0) {
                console.warn("Assignments array is empty.  No CSV data will be generated.");
                return res.status(500).json({ error: "No assignments generated." });  // Or some other appropriate error handling
            }

            const outputFilePath = path.join(outputDir, "secret_santa_assignments.csv");

            generateCSV(outputFilePath, assignments)
                .then(() => {
                    console.log("✅ CSV generation complete. Sending file.");
                    res.download(outputFilePath, "secret_santa_assignments.csv", (err) => {
                        if (err) {
                            console.error("❌ Error sending file:", err);
                            res.status(500).json({ error: "File download failed" });
                        }
                    });
                })
                .catch(err => {
                    console.error("❌ Error during CSV generation:", err);
                    res.status(500).json({ error: "CSV generation failed." });
                });


        } catch (error) {
            console.error("❌ Error processing Secret Santa:", error);
            res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    }
);


// ✅ Helper Functions
function parseCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
        const results = [];
        fastCsv
            .parseString(fileBuffer.toString(), { headers: true })
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
}


function assignSecretSanta(employees, previousAssignments) {
    let remainingReceivers = [...employees];
    let assignments = [];

    employees.forEach((giver) => {
        let possibleReceivers = remainingReceivers.filter(
            (r) =>
                r.Employee_EmailID !== giver.Employee_EmailID &&
                !previousAssignments.some(
                    (p) =>
                        p.Employee_EmailID === giver.Employee_EmailID &&
                        p.Secret_Child_EmailID === r.Employee_EmailID
                )
        );

        if (possibleReceivers.length === 0) {
            throw new Error(`❌ No valid assignment for ${giver.Employee_Name}`);
        }

        let secretChild =
            possibleReceivers[Math.floor(Math.random() * possibleReceivers.length)];

        assignments.push({
            Employee_Name: giver.Employee_Name,
            Employee_EmailID: giver.Employee_EmailID,
            Secret_Child_Name: secretChild.Employee_Name,
            Secret_Child_EmailID: secretChild.Employee_EmailID,
        });

        remainingReceivers = remainingReceivers.filter(
            (r) => r.Employee_EmailID !== secretChild.Employee_EmailID
        );
    });

    return assignments;
}

function generateCSV(filePath, data) {
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(filePath);
        fastCsv
            .write(data, { headers: true })
            .on("finish", () => {
                console.log(`✅ CSV File Written Successfully: ${filePath}`);
                resolve();
            })
            .on("error", (err) => {
                console.error("❌ Error writing CSV:", err);
                reject(err);
            })
            .pipe(ws);
    });
}


// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
