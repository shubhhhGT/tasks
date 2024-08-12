# Elasticsearch Node.js Application

This Node.js application provides an interface to interact with Elasticsearch. It includes endpoints for creating an index, adding documents to the index, and searching the index. The application uses the `@elastic/elasticsearch` client for interacting with Elasticsearch and `zod` for input validation.

## Features

- Create an Elasticsearch index
- Add documents to the index with validation
- Search the index for documents

## Prerequisites

- Node.js (>=14.x)
- Elasticsearch (running on `http://localhost:9200`)
- Docker

## Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run elasticsearch container**

   ```bash
   docker run -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.17.0
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

### Create Index

Endpoint: GET /create-index
Description: Creates an index named books in Elasticsearch.

response:

```
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "books"
}
```

### Add Document

Endpoint: POST /add-document

Description: Adds a document to the books index. Requires the following fields:

- id (string): Unique identifier for the document
- title (string): Title of the document (min 3 characters)
- author (string): Author of the document (min 3 characters)
- description (string): Description of the document (min 10 characters)

Request Body:

```
{
  "id": "unique-id",
  "title": "Document Title",
  "author": "Author Name",
  "description": "Detailed description of the document."
}
```

### Search Index

Endpoint: GET /search

Description: Searches the books index. Query parameter q is used to search across the fields title, author, and description.

Query Parameters:
q (string): Search query

Response:

```
[
  {
    "_index": "books",
    "_type": "_doc",
    "_id": "unique-id",
    "_score": 1.0,
    "_source": {
      "title": "Document Title",
      "author": "Author Name",
      "description": "Detailed description of the document."
    }
  }
]
```
