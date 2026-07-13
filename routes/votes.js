const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const votesFile = path.join(__dirname, '..', 'votes.json');

// Load votes from file
function loadVotes() {
    try {
        if (fs.existsSync(votesFile)) {
            return JSON.parse(fs.readFileSync(votesFile, 'utf8'));
        }
    } catch(e) {
        console.error('Error loading votes:', e);
    }
    return { newCount: 0, ogCount: 0 };
}

// Save votes to file
function saveVotes(votes) {
    try {
        fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));
    } catch(e) {
        console.error('Error saving votes:', e);
    }
}

// GET - Return current vote counts
router.get('/', (req, res) => {
    const votes = loadVotes();
    res.json(votes);
});

// POST - Submit a vote
router.post('/', (req, res) => {
    const { choice } = req.body;
    
    if (choice !== 'new' && choice !== 'og') {
        return res.status(400).json({ error: 'Choice must be "new" or "og"' });
    }

    const votes = loadVotes();
    
    if (choice === 'new') {
        votes.newCount++;
    } else {
        votes.ogCount++;
    }
    
    saveVotes(votes);
    res.json(votes);
});

module.exports = router;