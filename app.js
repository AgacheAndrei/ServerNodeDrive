require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Log = sequelize.define("Log", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  warning: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Connected to the database and synchronized models");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const app = express();
const port = process.env.PORT || 4090;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/log", async (req, res) => {
  try {
    const { warning, description } = req.body;
    console.log("Received body:", req.body); // Add this line for debugging
    const newLog = await Log.create({ warning, description });
    res.json(newLog);
  } catch (error) {
    next(error);
  }
});
  
app.get("/logs", async (req, res) => {
  const { warning, description } = req.body;

  try {
    const logs = await Log.findAll({
      where: {
        // Your conditions based on warning and description
      },
    });

    res.json(logs);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
    if (!req.body.warning || !req.body.description) {
      return res.status(400).json({ error: "Both warning and description are required." });
    }
    next();
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
