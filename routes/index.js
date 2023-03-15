const express = require('express');
const router = express.Router();

router.get('/ping', (req, res)=>{
    res.json({response: "pong", details: {project_name: "TaxAdda", version: "0.0.1", tag: "demo", description: "Backend assesment ..." } });
});

// if no url matched
router.get('/*', (req, res) => {
    return res.json({status: false, message: "wrong url..."});
});


module.exports = router;