const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const { z } = require("zod");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the Elasticsearch client
const esClient = new Client({ node: "http://localhost:9200" });

// Zod schema for document validation
const documentSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  author: z.string().min(3, "Author must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
});

// Create an index
app.get("/create-index", async (req, res) => {
  try {
    const response = await esClient.indices.create({
      index: "books",
    });
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// Add a document to the index
app.post("/add-document", async (req, res) => {
  // Validate the request body
  const parsed = documentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: parsed.error.errors,
    });
  }

  const { id, title, author, description } = req.body;

  try {
    // Check if the document with the given ID already exists
    const { body: exists } = await esClient.exists({
      index: "books",
      id: id,
    });

    if (exists) {
      return res
        .status(400)
        .json({ error: "Document with this ID already exists." });
    }

    // Add the document if it doesn't exist
    const response = await esClient.index({
      index: "books",
      id: id, // Unique identifier for the document
      body: {
        title,
        author,
        description,
      },
    });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// Search the index
app.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const response = await esClient.search({
      index: "books",
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ["title", "author", "description"],
          },
        },
      },
    });

    // console.log(response);
    res.send(response.hits.hits);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
