const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


router.get('/', async(req, res) => {
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    }catch(err){
        res.json({message: err});
    }
});


router.get('/:id', async(req, res) => {
    try{
        const tasks = await Task.findById(req.param.id);
        res.status(200).json(tasks);
    }catch(err){
        res.json({message: err});
    }
});

router.post('/', async(req, res) => {
    const task = new Task({
        id: req.body.id,
        name: req.body.name,
        done: req.body.done,
        geolocalizacion: req.body.geolocalizacion
    });

    try{
        const savedTask = await task.save();
        res.status(200).json(savedTask);
    }catch(err){
        res.json({message: err});
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const removedTask = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json(removedTask);
    }catch(err){
        res.json({message: err});
    }
});

router.put('/:id', async(req, res) => {
    try{
        const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          });
        res.status(200).json(updateTask);
       
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;