import express from 'express';
const router = express.Router();

// Our local in-memory database array
let localLogsDatabase = [];

// 🚪 DOOR 1: Save a log (POST)
router.post('/', (req, res) => {
    try {
        // We catch both naming variations (React variants and native backend keys) for ultimate safety
        const { title, layer, category, diagnostics, description, tags } = req.body;
        
        const newLog = {
            _id: 'mock_' + Math.random().toString(36).substr(2, 9),
            title: title || 'Untitled Operation',
            
            // 🛡️ Map layer selection into category column smoothly
            category: category || layer || 'Frontend Interface',
            layer: category || layer || 'Frontend Interface',
            
            // 🛡️ Map diagnostics data securely into the system trace variable
            description: description || diagnostics || 'No parameters recorded.',
            diagnostics: description || diagnostics || 'No parameters recorded.',
            
            tags: tags || [],
            timestamp: new Date().toLocaleString(),
            createdAt: new Date()
        };
        
        localLogsDatabase.push(newLog);
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🚪 DOOR 2: Get all logs (GET)
router.get('/', (req, res) => {
    res.status(200).json(localLogsDatabase);
});

// 🚪 DOOR 3: Update a specific log by ID (PUT)
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, layer, category, diagnostics, description, tags } = req.body;
        
        const logIndex = localLogsDatabase.findIndex(log => log._id === id);
        
        if (logIndex === -1) {
            return res.status(404).json({ message: "Log entry not found" });
        }
        
        // Safety check upgrades for modifications
        if (title) localLogsDatabase[logIndex].title = title;
        if (category || layer) {
            const finalLayer = category || layer;
            localLogsDatabase[logIndex].category = finalLayer;
            localLogsDatabase[logIndex].layer = finalLayer;
        }
        if (description || diagnostics) {
            const finalDiag = description || diagnostics;
            localLogsDatabase[logIndex].description = finalDiag;
            localLogsDatabase[logIndex].diagnostics = finalDiag;
        }
        if (tags) localLogsDatabase[logIndex].tags = tags;
        
        res.status(200).json({ message: "Log updated successfully!", updatedLog: localLogsDatabase[logIndex] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🚪 DOOR 4: Delete a specific log by ID (DELETE)
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const initialLength = localLogsDatabase.length;
        
        localLogsDatabase = localLogsDatabase.filter(log => log._id !== id);
        
        if (localLogsDatabase.length === initialLength) {
            return res.status(404).json({ message: "Log entry not found" });
        }
        
        res.status(200).json({ message: "Log entry deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;