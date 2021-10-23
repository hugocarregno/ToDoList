const {Schema, model} = require('mongoose');

const taskSchema = new Schema({
    id:{
        type: Number
    },
    name:{
        type: String
    },
    done:{
        type: Boolean
    },
    geolocalizacion:{
        type: Object
    }
})

module.exports = model("Task", taskSchema);