const router = require('express').Router();
const protect = require('../middleware/protect');
const Message = require('../models/Messages')
const multer = require('multer');

router.get('/', protect, async (req,res) => {
    try {
        const message = await Message.find();
        if(message){
            res.status(200).json({
                success: true,
                data: message
            })
        }
    } catch (err) {
        return res.status(500).json({
            err: err.message
        })
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/') // upload directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.post('/', protect, async (req,res) => {
    try {
        const text = req.body.text

        const newMessage = new Message({
            text: text,
            postedBy: req.user.id
        })

        await newMessage.save();

        res.status(201).json({
            success: true,
            data: newMessage
        })

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.delete('/:id', protect, async (req,res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if(message){
            res.status(200).json({success: true, data: {}})
        }else{
            return res.status(400).json({err: "Message not found"})
        }
       
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

module.exports = router