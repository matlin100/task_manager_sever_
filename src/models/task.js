const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: false,
        trim: true
      },
      description: {
        type: String,
        required: false,
        trim: false
      },
      color: {
        type: String,
        required: true,
        default: 'blue'
      },
      completed: {
        type: Boolean,
        default: false,
        required:true
      },
       isPublic: {
        type: Boolean,
        default: false,
        required: true,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    },
    {
      timestamps: true
    }
  );
  


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
