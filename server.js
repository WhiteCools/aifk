const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001;

// MongoDB connection URL
const mongoUrl = 'mongodb+srv://chuyahmad:9n4Usa3itVF5B3vk@data-set.2u5t5.mongodb.net/?retryWrites=true&w=majority';
let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl);
    db = client.db('flazu');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongo();

app.use(cors());
app.use(express.json());

// Setup Collection Endpoints
app.get('/api/setup/:serverId', async (req, res) => {
  try {
    const setupc = db.collection('setup');
    const setup = await setupc.findOne({ server_id: req.params.serverId });
    res.json(setup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/setup', async (req, res) => {
  try {
    const { serverId, setupType, channelId } = req.body;
    const setupc = db.collection('setup');
    
    // Delete old setup if exists
    await setupc.deleteOne({ server_id: serverId });
    
    // Save new setup
    await setupc.insertOne({
      server_id: serverId,
      setup_type: setupType,
      channel_or_category_id: channelId
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q&A Collection Endpoints
app.get('/api/qa/:serverId', async (req, res) => {
  try {
    const dataset = db.collection('dataset');
    const qa = await dataset.findOne({ server_id: req.params.serverId });
    res.json(qa?.qa_data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/qa', async (req, res) => {
  try {
    const { serverId, question, answer } = req.body;
    const dataset = db.collection('dataset');

    // First, check if document exists
    const existingDoc = await dataset.findOne({ server_id: serverId });
    
    if (!existingDoc) {
      // If document doesn't exist, create new one
      await dataset.insertOne({
        server_id: serverId,
        qa_data: {
          [question]: answer
        }
      });
    } else {
      // If document exists, update qa_data
      await dataset.updateOne(
        { server_id: serverId },
        { 
          $set: { 
            [`qa_data.${question}`]: answer
          }
        }
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding QA:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/qa/:serverId/:question', async (req, res) => {
  try {
    const { serverId, question } = req.params;
    const dataset = db.collection('dataset');
    
    await dataset.updateOne(
      { server_id: serverId },
      { $unset: { [`qa_data.${question}`]: "" } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/qa/bulk/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const { questions } = req.body;
    const dataset = db.collection('dataset');
    
    const unsetObj = questions.reduce((acc, question) => {
      acc[`qa_data.${question}`] = "";
      return acc;
    }, {});

    await dataset.updateOne(
      { server_id: serverId },
      { $unset: unsetObj }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
